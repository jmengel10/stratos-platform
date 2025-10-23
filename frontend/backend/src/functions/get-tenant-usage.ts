/**
 * StratOS Platform - Get Tenant Usage HTTP Function
 * 
 * Retrieve tenant usage statistics and quota information
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../utils/auth';
import { CosmosService } from '../services/cosmos.service';
import { insights } from '../services/insights.service';
import { Tenant } from '../models';

const cosmosService = new CosmosService();

async function usageHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Validate authentication
    const user = validateToken(request);

    context.log(`Get usage for tenant: ${user.tenantId}`);

    // Get tenant data
    const tenant = await cosmosService.getDocument<Tenant>(
      'tenants',
      user.tenantId,
      user.tenantId
    );

    if (!tenant) {
      return {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        jsonBody: {
          error: 'Tenant not found',
          code: 'TENANT_NOT_FOUND',
        },
      };
    }

    // Calculate usage percentages
    const requestsPercentage = (tenant.usage.requestsThisMonth / tenant.quota.maxRequestsPerMonth) * 100;
    const storagePercentage = (tenant.usage.storageUsedMB / tenant.quota.maxStorageMB) * 100;

    // Get usage trends (last 30 days)
    const trends = await getUsageTrends(user.tenantId);

    // Track activity
    insights.trackUserActivity('view-usage', user.userId, user.tenantId);

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        tenant: {
          id: tenant.id,
          name: tenant.name,
          industry: tenant.industry,
          plan: tenant.plan,
        },
        usage: {
          requestsThisMonth: tenant.usage.requestsThisMonth,
          storageUsedMB: tenant.usage.storageUsedMB,
          lastResetDate: tenant.usage.lastResetDate,
        },
        quota: {
          maxRequestsPerMonth: tenant.quota.maxRequestsPerMonth,
          maxStorageMB: tenant.quota.maxStorageMB,
        },
        percentages: {
          requests: Math.round(requestsPercentage),
          storage: Math.round(storagePercentage),
        },
        remaining: {
          requests: Math.max(0, tenant.quota.maxRequestsPerMonth - tenant.usage.requestsThisMonth),
          storageMB: Math.max(0, tenant.quota.maxStorageMB - tenant.usage.storageUsedMB),
        },
        trends,
      },
    };

  } catch (error: any) {
    context.error('Get usage error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/tenant/usage',
    });

    return {
      status: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        error: error.message || 'Failed to get usage',
        code: error.code || 'USAGE_ERROR',
      },
    };
  }
}

/**
 * Get usage trends for the last 30 days
 * (Placeholder implementation - in production, query from time-series data)
 */
async function getUsageTrends(tenantId: string): Promise<any[]> {
  // In production, this would query Application Insights or a time-series database
  // For now, return mock data
  const trends = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    trends.push({
      date: date.toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 50) + 10,
      tokensUsed: Math.floor(Math.random() * 50000) + 10000,
    });
  }

  return trends;
}

app.http('get-tenant-usage', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'tenant/usage',
  handler: usageHandler,
});

