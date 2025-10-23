/**
 * StratOS Platform - Chat HTTP Function
 * 
 * Main endpoint for AI agent conversations
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../utils/auth';
import { AgentRouter, AgentDefinition } from '../utils/routing';
import { CosmosService } from '../services/cosmos.service';
import { insights } from '../services/insights.service';
import { GTMStrategistAgent } from '../agents/gtm-strategist';
import { OpsAnalystAgent } from '../agents/ops-analyst';
import { FundraisingAdvisorAgent } from '../agents/fundraising-advisor';
import { ProductStrategistAgent } from '../agents/product-strategist';
import { DataAnalystAgent } from '../agents/data-analyst';
import { ChatRequest, ChatResponse, Tenant, RateLimitError, ValidationError } from '../models';

// Initialize agents
const agents = {
  'gtm-strategist': new GTMStrategistAgent(),
  'ops-analyst': new OpsAnalystAgent(),
  'fundraising-advisor': new FundraisingAdvisorAgent(),
  'product-strategist': new ProductStrategistAgent(),
  'data-analyst': new DataAnalystAgent(),
};

// Initialize router
const agentDefinitions: AgentDefinition[] = [
  {
    id: 'gtm-strategist',
    name: 'GTM Strategist',
    description: 'Go-to-market strategy, positioning, and launch planning',
    keywords: ['market', 'launch', 'positioning', 'gtm', 'segment', 'channel'],
    capabilities: agents['gtm-strategist'].capabilities,
  },
  {
    id: 'ops-analyst',
    name: 'Ops & Cost Analyst',
    description: 'Operational efficiency and cost optimization',
    keywords: ['cost', 'efficiency', 'operations', 'roi', 'process', 'vendor'],
    capabilities: agents['ops-analyst'].capabilities,
  },
  {
    id: 'fundraising-advisor',
    name: 'Fundraising Advisor',
    description: 'Fundraising strategy, pitch decks, and investor targeting',
    keywords: ['raise', 'funding', 'investor', 'pitch', 'valuation', 'capital'],
    capabilities: agents['fundraising-advisor'].capabilities,
  },
  {
    id: 'product-strategist',
    name: 'Product Strategist',
    description: 'Product roadmaps and feature prioritization',
    keywords: ['product', 'roadmap', 'feature', 'user', 'persona', 'backlog'],
    capabilities: agents['product-strategist'].capabilities,
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Data analysis, insights, and visualization',
    keywords: ['data', 'analyze', 'metrics', 'statistics', 'visualization', 'insight'],
    capabilities: agents['data-analyst'].capabilities,
  },
];

const router = new AgentRouter(agentDefinitions);
const cosmos = new CosmosService();

/**
 * Chat endpoint - main entry point for agent conversations
 */
async function chatHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const startTime = Date.now();
  
  try {
    // 1. Validate authentication
    const user = validateToken(request);
    context.log(`Chat request from user: ${user.userId}, tenant: ${user.tenantId}`);

    // 2. Parse request body
    const body = await request.json() as ChatRequest;
    
    if (!body.message || typeof body.message !== 'string') {
      throw new ValidationError('Message is required');
    }

    // 2b. Validate hierarchy (for new conversations)
    if (!body.conversationId && body.projectId) {
      // Verify project exists and belongs to tenant
      const project = await cosmos.getDocument('projects', { id: body.projectId, tenantId: user.tenantId });
      if (!project) {
        throw new ValidationError('Project not found');
      }
      
      // Get client to include industry context
      if (body.clientId) {
        const client = await cosmos.getDocument('clients', { id: body.clientId, tenantId: user.tenantId });
        if (client && client.industry && !body.industry) {
          body.industry = client.industry;
        }
      }
    }

    // 3. Check usage limits
    const tenant = await cosmos.getDocument<Tenant>('tenants', user.tenantId, user.tenantId);
    
    if (!tenant) {
      throw new ValidationError('Tenant not found');
    }

    if (tenant.usage.requestsThisMonth >= tenant.quota.maxRequestsPerMonth) {
      throw new RateLimitError(`Monthly quota exceeded (${tenant.quota.maxRequestsPerMonth} requests)`);
    }

    // 4. Route to appropriate agent
    let agentId: string;
    
    if (body.agentName) {
      // Use specified agent
      const agentKey = body.agentName.toLowerCase().replace(/ /g, '-').replace(/&/g, '');
      agentId = Object.keys(agents).find(k => k === agentKey) || 'gtm-strategist';
    } else {
      // Auto-route based on message
      agentId = await router.route(body.message, {
        tenantId: user.tenantId,
        userId: user.userId,
        industry: body.industry,
        conversationHistory: body.conversationId ? await getConversationHistory(body.conversationId, user.tenantId) : undefined,
      });
    }

    const agent = agents[agentId as keyof typeof agents];
    
    if (!agent) {
      throw new ValidationError(`Agent not found: ${agentId}`);
    }

    context.log(`Routing to agent: ${agent.name}`);

    // 5. Execute agent
    const agentResponse = await agent.execute(body.message, {
      tenantId: user.tenantId,
      userId: user.userId,
      industry: body.industry,
      previousContext: body.previousContext,
      conversationHistory: body.conversationId ? await getConversationHistory(body.conversationId, user.tenantId) : undefined,
    });

    // 6. Suggest next agent
    const nextAgent = await router.suggestNextAgent(agentId, body.message, agentResponse.content);

    // 7. Update tenant usage
    await updateTenantUsage(user.tenantId, agentResponse.metadata?.tokensUsed || 0);

    // 8. Track metrics
    const duration = Date.now() - startTime;
    insights.trackUserActivity('chat', user.userId, user.tenantId, {
      agentName: agent.name,
      industry: body.industry || 'none',
      hasConversationId: !!body.conversationId,
    });

    insights.trackApiUsage(user.tenantId, '/api/chat', agentResponse.metadata?.tokensUsed || 0);

    // 9. Build response
    const response: ChatResponse = {
      agentName: agent.name,
      response: agentResponse,
      conversationId: body.conversationId || 'new',
      suggestions: agentResponse.suggestions,
      nextAgent: nextAgent || undefined,
    };

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: response,
    };

  } catch (error: any) {
    context.error('Chat error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/chat',
    });

    const status = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    return {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        error: message,
        code: error.code || 'INTERNAL_ERROR',
      },
    };
  }
}

/**
 * Get conversation history from Cosmos DB
 */
async function getConversationHistory(conversationId: string, tenantId: string) {
  try {
    const conversation = await cosmos.getDocument('conversations', conversationId, tenantId);
    return conversation?.messages || [];
  } catch (error) {
    console.error('Failed to get conversation history:', error);
    return [];
  }
}

/**
 * Update tenant usage statistics
 */
async function updateTenantUsage(tenantId: string, tokensUsed: number): Promise<void> {
  try {
    const tenant = await cosmos.getDocument<Tenant>('tenants', tenantId, tenantId);
    
    if (tenant) {
      tenant.usage.requestsThisMonth += 1;
      
      // Reset monthly counter if needed
      const lastReset = new Date(tenant.usage.lastResetDate);
      const now = new Date();
      
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        tenant.usage.requestsThisMonth = 1;
        tenant.usage.lastResetDate = now.toISOString();
      }

      await cosmos.updateDocument('tenants', tenant);
    }
  } catch (error) {
    console.error('Failed to update tenant usage:', error);
    // Don't throw - usage tracking failure shouldn't break the request
  }
}

// Register function
app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: chatHandler,
});

