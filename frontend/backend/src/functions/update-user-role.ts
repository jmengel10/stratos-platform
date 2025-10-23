/**
 * StratOS Platform - Update User Role Function
 * 
 * Update user's role (admin only)
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { requireRole, AuthContext } from '../utils/auth';
import { TenantService } from '../services/tenant.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';

const tenantService = new TenantService();

async function updateUserRoleHandler(
  request: HttpRequest,
  context: AuthContext
): Promise<HttpResponseInit> {
  try {
    const user = context.user!;
    const userId = request.params.userId;
    const body = await request.json() as { role: string };

    // Validate input
    if (!userId || !body.role) {
      throw new ValidationError('User ID and role are required');
    }

    const validRoles = ['member', 'admin', 'owner'];
    if (!validRoles.includes(body.role)) {
      throw new ValidationError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    context.log(`Updating role for user ${userId} to ${body.role}`);

    // Get target user
    const targetUser = await tenantService.getUser(userId, user.tenantId);
    
    if (!targetUser) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      };
    }

    // Prevent self-role change
    if (targetUser.id === user.userId) {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Cannot change your own role',
          code: 'SELF_ROLE_CHANGE',
        },
      };
    }

    // Prevent changing owner role (only one owner per tenant)
    if (targetUser.roles.includes('owner') && body.role !== 'owner') {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Cannot change owner role',
          code: 'OWNER_ROLE_PROTECTED',
        },
      };
    }

    // Update role
    const updated = await tenantService.updateUser(userId, user.tenantId, {
      roles: [body.role],
    });

    // Track change
    insights.trackEvent('UserRoleUpdated', {
      userId,
      tenantId: user.tenantId,
      oldRoles: targetUser.roles,
      newRole: body.role,
      updatedBy: user.userId,
    });

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        message: 'User role updated successfully',
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          roles: updated.roles,
        },
      },
    };

  } catch (error: any) {
    context.error('Update user role error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/users/:userId/role',
    });

    return {
      status: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        error: error.message || 'Failed to update user role',
        code: error.code || 'UPDATE_ERROR',
      },
    };
  }
}

app.http('update-user-role', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'users/{userId}/role',
  handler: requireRole(['admin', 'owner'], updateUserRoleHandler),
});

