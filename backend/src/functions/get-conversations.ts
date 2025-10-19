/**
 * StratOS Platform - Get Conversations HTTP Function
 * 
 * Retrieve user's conversation history with pagination
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../utils/auth';
import { CosmosService } from '../services/cosmos.service';
import { insights } from '../services/insights.service';

const cosmosService = new CosmosService();

async function conversationsHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Validate authentication
    const user = validateToken(request);

    // Parse query parameters
    const limit = parseInt(request.query.get('limit') || '20');
    const skip = parseInt(request.query.get('skip') || '0');
    const agentName = request.query.get('agent');
    const startDate = request.query.get('startDate');
    const endDate = request.query.get('endDate');

    context.log(`Get conversations for user: ${user.userId}`);

    // Build query
    let query = 'SELECT * FROM c WHERE c.userId = @userId';
    const parameters: any[] = [{ name: '@userId', value: user.userId }];

    // Add optional filters
    if (agentName) {
      query += ' AND c.agentName = @agentName';
      parameters.push({ name: '@agentName', value: agentName });
    }

    if (startDate) {
      query += ' AND c.createdAt >= @startDate';
      parameters.push({ name: '@startDate', value: startDate });
    }

    if (endDate) {
      query += ' AND c.createdAt <= @endDate';
      parameters.push({ name: '@endDate', value: endDate });
    }

    // Order by most recent
    query += ' ORDER BY c.lastMessageAt DESC';

    // Query conversations
    const result = await cosmosService.queryDocuments(
      'conversations',
      { query, parameters },
      user.tenantId,
      { limit, skip: skip }
    );

    // Create conversation previews (exclude full message history)
    const conversations = result.items.map((conv: any) => ({
      id: conv.id,
      title: conv.title,
      agentName: conv.agentName,
      messageCount: conv.messages?.length || 0,
      lastMessage: conv.messages?.[conv.messages.length - 1]?.content?.substring(0, 100) || '',
      createdAt: conv.createdAt,
      lastMessageAt: conv.lastMessageAt,
    }));

    // Track activity
    insights.trackUserActivity('view-conversations', user.userId, user.tenantId, {
      count: conversations.length,
    });

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        conversations,
        count: result.count,
        hasMore: result.hasMore,
        continuationToken: result.continuationToken,
      },
    };

  } catch (error: any) {
    context.error('Get conversations error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/conversations',
    });

    return {
      status: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        error: error.message || 'Failed to get conversations',
        code: error.code || 'QUERY_ERROR',
      },
    };
  }
}

app.http('get-conversations', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'conversations',
  handler: conversationsHandler,
});

