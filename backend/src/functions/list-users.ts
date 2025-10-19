/**
 * StratOS Platform - List Users Function
 * 
 * List all users in tenant (admin only)
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { requireRole, AuthContext } from '../utils/auth';
import { TenantService } from '../services/tenant.service';
import { insights } from '../services/insights.service';

const tenantService = new TenantService();

async function listUsersHandler(
  request: HttpRequest,
  context: AuthContext
): Promise<HttpResponseInit> {
  try {
    const user = context.user!;
    
    // Parse query parameters
    const roleFilter = request.query.get('role');
    const statusFilter = request.query.get('status');

    context.log(`Listing users for tenant ${user.tenantId}`);

    // Get all users in tenant
    let users = await tenantService.getTenantUsers(user.tenantId);

    // Apply filters
    if (roleFilter) {
      users = users.filter(u => u.roles.includes(roleFilter));
    }

    if (statusFilter) {
      users = users.filter(u => u.status === statusFilter);
    }

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Format response (remove sensitive data)
    const formattedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      roles: u.roles,
      status: u.status,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    }));

    // Track activity
    insights.trackUserActivity('list-users', user.userId, user.tenantId, {
      count: formattedUsers.length,
    });

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        users: formattedUsers,
        count: formattedUsers.length,
      },
    };

  } catch (error: any) {
    context.error('List users error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/users',
    });

    return {
      status: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        error: error.message || 'Failed to list users',
        code: error.code || 'LIST_ERROR',
      },
    };
  }
}

app.http('list-users', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users',
  handler: requireRole(['admin', 'owner'], listUsersHandler),
});

