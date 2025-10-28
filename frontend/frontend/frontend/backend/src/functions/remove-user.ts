/**
 * StratOS Platform - Remove User Function
 * 
 * Remove user from tenant (admin only)
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { requireRole, AuthContext } from '../utils/auth';
import { TenantService } from '../services/tenant.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';

const tenantService = new TenantService();

async function removeUserHandler(
  request: HttpRequest,
  context: AuthContext
): Promise<HttpResponseInit> {
  try {
    const user = context.user!;
    const userId = request.params.userId;

    // Validate input
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    context.log(`Removing user ${userId} from tenant ${user.tenantId}`);

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

    // Prevent self-deletion
    if (targetUser.id === user.userId) {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Cannot remove yourself',
          code: 'SELF_REMOVAL',
        },
      };
    }

    // Prevent removing owner
    if (targetUser.roles.includes('owner')) {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Cannot remove tenant owner',
          code: 'OWNER_REMOVAL',
        },
      };
    }

    // Check if this is the last admin
    const allUsers = await tenantService.getTenantUsers(user.tenantId);
    const admins = allUsers.filter(u => 
      u.status === 'active' && (u.roles.includes('admin') || u.roles.includes('owner'))
    );

    if (admins.length === 1 && targetUser.roles.includes('admin')) {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Cannot remove the last admin',
          code: 'LAST_ADMIN',
        },
      };
    }

    // Update user status to removed (soft delete)
    const updated = await tenantService.updateUser(userId, user.tenantId, {
      status: 'suspended', // Use suspended instead of hard delete
    });

    // Track removal
    insights.trackEvent('UserRemoved', {
      userId,
      tenantId: user.tenantId,
      removedBy: user.userId,
      userEmail: targetUser.email,
    });

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        message: 'User removed successfully',
        user: {
          id: updated.id,
          email: updated.email,
          status: updated.status,
        },
      },
    };

  } catch (error: any) {
    context.error('Remove user error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/users/:userId',
    });

    return {
      status: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        error: error.message || 'Failed to remove user',
        code: error.code || 'REMOVE_ERROR',
      },
    };
  }
}

app.http('remove-user', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'users/{userId}',
  handler: requireRole(['admin', 'owner'], removeUserHandler),
});

