/**
 * StratOS Platform - Search Context HTTP Function
 * 
 * Search documents using hybrid search (keyword + vector)
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../utils/auth';
import { SearchService } from '../services/search.service';
import { insights } from '../services/insights.service';
import { SearchRequest, ValidationError } from '../models';

const searchService = new SearchService();

async function searchHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Validate authentication
    const user = validateToken(request);

    // Parse request body
    const body = await request.json() as SearchRequest;
    
    if (!body.query || typeof body.query !== 'string') {
      throw new ValidationError('Query is required');
    }

    context.log(`Search request from user: ${user.userId}, query: "${body.query}"`);

    // Perform search
    const results = await searchService.search({
      query: body.query,
      filters: {
        ...body.filters,
        tenantId: user.tenantId, // Always filter by tenant
      },
      top: body.limit || 10,
      useVector: body.useVector !== false,
    });

    // Track search event
    insights.trackUserActivity('search', user.userId, user.tenantId, {
      query: body.query,
      resultsCount: results.length,
      useVector: body.useVector !== false,
    });

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        results,
        count: results.length,
      },
    };

  } catch (error: any) {
    context.error('Search error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/search',
    });

    return {
      status: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        error: error.message || 'Search failed',
        code: error.code || 'SEARCH_ERROR',
      },
    };
  }
}

app.http('search-context', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'search',
  handler: searchHandler,
});

