/**
 * StratOS Platform - Agent Router
 * 
 * Intelligently routes user queries to the most appropriate agent using
 * GPT-4 for intent analysis and few-shot learning.
 */

import { OpenAIService } from '../services/openai.service';
import { AgentContext, Message } from '../models';
import { insights } from '../services/insights.service';

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  capabilities: string[];
}

export class AgentRouter {
  private openai: OpenAIService;
  private agents: Map<string, AgentDefinition>;

  constructor(agents: AgentDefinition[]) {
    this.openai = new OpenAIService();
    this.agents = new Map(agents.map(a => [a.id, a]));
  }

  /**
   * Route user message to the best agent
   * 
   * @param userMessage - User's input message
   * @param context - Agent context with history
   * @returns Agent ID
   */
  async route(userMessage: string, context: AgentContext): Promise<string> {
    const startTime = Date.now();

    try {
      // If there's a clear previous agent and the message is a follow-up, stick with it
      if (this.isFollowUpMessage(userMessage) && context.conversationHistory) {
        const previousAgent = this.getPreviousAgent(context.conversationHistory);
        if (previousAgent) {
          insights.trackEvent('AgentRouting', {
            routingMethod: 'follow-up',
            selectedAgent: previousAgent,
          });
          return previousAgent;
        }
      }

      // Use GPT-4 for intelligent routing
      const routingPrompt = this.buildRoutingPrompt(userMessage, context);
      const completion = await this.openai.chat(
        [{ role: 'user', content: routingPrompt }],
        {
          temperature: 0.3, // Low temperature for more deterministic routing
          maxTokens: 100,
        }
      );

      // Parse the response to extract agent ID
      const agentId = this.parseAgentSelection(completion.content);

      // Validate agent exists
      if (!this.agents.has(agentId)) {
        console.warn(`Invalid agent selected: ${agentId}, falling back to default`);
        return this.getDefaultAgent(userMessage);
      }

      const duration = Date.now() - startTime;
      insights.trackEvent('AgentRouting', {
        routingMethod: 'ai',
        selectedAgent: agentId,
        duration,
        tokensUsed: completion.tokensUsed,
      });

      return agentId;
    } catch (error) {
      console.error('Agent routing error:', error);
      insights.trackException(error as Error, { operation: 'agentRouting' });
      
      // Fallback to keyword-based routing
      return this.keywordBasedRouting(userMessage);
    }
  }

  /**
   * Suggest next agent based on current conversation
   * 
   * @param currentAgentId - Currently active agent
   * @param userMessage - User's message
   * @param response - Agent's response
   * @returns Suggested next agent ID or null
   */
  async suggestNextAgent(
    currentAgentId: string,
    userMessage: string,
    response: string
  ): Promise<string | null> {
    // Predefined agent chains based on common workflows
    const agentChains: Record<string, string[]> = {
      'gtm-strategist': ['ops-analyst', 'fundraising-advisor', 'product-strategist'],
      'ops-analyst': ['fundraising-advisor', 'gtm-strategist'],
      'fundraising-advisor': ['gtm-strategist', 'ops-analyst'],
      'product-strategist': ['gtm-strategist', 'data-analyst'],
      'data-analyst': ['product-strategist', 'ops-analyst'],
    };

    const possibleNextAgents = agentChains[currentAgentId] || [];

    // Analyze response for keywords that suggest next agent
    for (const nextAgentId of possibleNextAgents) {
      const agent = this.agents.get(nextAgentId);
      if (!agent) continue;

      // Check if response mentions keywords related to this agent
      const responseText = (response + ' ' + userMessage).toLowerCase();
      const keywordMatches = agent.keywords.filter(k => 
        responseText.includes(k.toLowerCase())
      );

      if (keywordMatches.length >= 2) {
        return nextAgentId;
      }
    }

    return null;
  }

  /**
   * Build routing prompt for GPT-4
   * 
   * @param userMessage - User message
   * @param context - Agent context
   * @returns Routing prompt
   */
  private buildRoutingPrompt(userMessage: string, context: AgentContext): string {
    const agentList = Array.from(this.agents.values())
      .map(a => `- ${a.id}: ${a.description}`)
      .join('\n');

    const industryContext = context.industry ? `\nIndustry: ${context.industry}` : '';

    return `You are an intelligent routing system for a strategy consulting platform. Route the user's query to the most appropriate specialist agent.

Available Agents:
${agentList}
${industryContext}

Routing Rules:
1. "launch", "market", "positioning", "GTM" → gtm-strategist
2. "cost", "efficiency", "operations", "ROI" → ops-analyst
3. "raise", "funding", "investor", "pitch" → fundraising-advisor
4. "roadmap", "feature", "product", "user" → product-strategist
5. "data", "analyze", "metrics", "statistics" → data-analyst

User Query: "${userMessage}"

Respond ONLY with the agent ID (e.g., "gtm-strategist"). No explanation needed.

Agent ID:`;
  }

  /**
   * Parse agent selection from GPT-4 response
   * 
   * @param response - GPT-4 response
   * @returns Agent ID
   */
  private parseAgentSelection(response: string): string {
    // Extract agent ID from response
    const cleaned = response.trim().toLowerCase();
    
    // Check if response contains a valid agent ID
    for (const agentId of this.agents.keys()) {
      if (cleaned.includes(agentId)) {
        return agentId;
      }
    }

    // Fallback: try to extract from quoted or first line
    const firstLine = cleaned.split('\n')[0].replace(/[^a-z-]/g, '');
    if (this.agents.has(firstLine)) {
      return firstLine;
    }

    // Return default if no match
    return 'gtm-strategist';
  }

  /**
   * Keyword-based routing as fallback
   * 
   * @param userMessage - User message
   * @returns Agent ID
   */
  private keywordBasedRouting(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();
    const scores: Map<string, number> = new Map();

    // Score each agent based on keyword matches
    for (const [agentId, agent] of this.agents) {
      let score = 0;
      for (const keyword of agent.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      scores.set(agentId, score);
    }

    // Find agent with highest score
    let maxScore = 0;
    let selectedAgent = 'gtm-strategist'; // Default

    for (const [agentId, score] of scores) {
      if (score > maxScore) {
        maxScore = score;
        selectedAgent = agentId;
      }
    }

    insights.trackEvent('AgentRouting', {
      routingMethod: 'keyword-fallback',
      selectedAgent,
      score: maxScore,
    });

    return selectedAgent;
  }

  /**
   * Get default agent based on simple heuristics
   * 
   * @param userMessage - User message
   * @returns Agent ID
   */
  private getDefaultAgent(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();

    // Simple keyword matching for common cases
    if (messageLower.includes('cost') || messageLower.includes('efficient')) {
      return 'ops-analyst';
    }
    if (messageLower.includes('fund') || messageLower.includes('investor')) {
      return 'fundraising-advisor';
    }
    if (messageLower.includes('data') || messageLower.includes('analyz')) {
      return 'data-analyst';
    }
    if (messageLower.includes('feature') || messageLower.includes('roadmap')) {
      return 'product-strategist';
    }

    // Default to GTM strategist for general strategy questions
    return 'gtm-strategist';
  }

  /**
   * Check if message is a follow-up question
   * 
   * @param message - User message
   * @returns True if follow-up
   */
  private isFollowUpMessage(message: string): boolean {
    const followUpIndicators = [
      'more detail',
      'elaborate',
      'explain',
      'what about',
      'how about',
      'also',
      'additionally',
      'furthermore',
      'can you',
      'could you',
      'tell me more',
    ];

    const messageLower = message.toLowerCase();
    return followUpIndicators.some(indicator => messageLower.includes(indicator));
  }

  /**
   * Get previous agent from conversation history
   * 
   * @param history - Conversation history
   * @returns Agent ID or null
   */
  private getPreviousAgent(history: Message[]): string | null {
    // Look for agent name in conversation metadata
    // In a real implementation, this would be stored in conversation metadata
    // For now, return null to force routing
    return null;
  }

  /**
   * Get agent definition by ID
   * 
   * @param agentId - Agent ID
   * @returns Agent definition or undefined
   */
  getAgent(agentId: string): AgentDefinition | undefined {
    return this.agents.get(agentId);
  }

  /**
   * List all available agents
   * 
   * @returns Array of agent definitions
   */
  getAllAgents(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }
}

