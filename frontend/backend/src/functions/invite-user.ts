/**
 * StratOS Platform - Invite User Function
 * 
 * Allow admins to invite new users to their tenant
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { requireRole, AuthContext } from '../utils/auth';
import { TenantService } from '../services/tenant.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';

const tenantService = new TenantService();

async function inviteUserHandler(
  request: HttpRequest,
  context: AuthContext
): Promise<HttpResponseInit> {
  try {
    const user = context.user!;
    const body = await request.json() as { email: string; role: string };

    // Validate input
    if (!body.email || !body.role) {
      throw new ValidationError('Email and role are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw new ValidationError('Invalid email address');
    }

    const validRoles = ['member', 'admin'];
    if (!validRoles.includes(body.role)) {
      throw new ValidationError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    context.log(`Inviting user ${body.email} to tenant ${user.tenantId} with role ${body.role}`);

    // Check if user already exists
    const existingUsers = await tenantService.getTenantUsers(user.tenantId);
    const exists = existingUsers.find(u => u.email.toLowerCase() === body.email.toLowerCase());
    
    if (exists) {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'User already exists in this tenant',
          code: 'USER_EXISTS',
        },
      };
    }

    // Invite user
    const invitedUser = await tenantService.inviteUser(
      user.tenantId,
      body.email,
      body.role
    );

    // Track event
    insights.trackUserActivity('invite-user', user.userId, user.tenantId, {
      invitedEmail: body.email,
      role: body.role,
    });

    // Generate invite link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${frontendUrl}/accept-invite?token=${invitedUser.inviteToken}`;

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        message: 'User invited successfully',
        user: {
          id: invitedUser.id,
          email: invitedUser.email,
          role: invitedUser.roles[0],
          status: invitedUser.status,
        },
        inviteLink,
        expiresAt: invitedUser.inviteExpiry,
      },
    };

  } catch (error: any) {
    context.error('Invite user error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/users/invite',
    });

    return {
      status: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        error: error.message || 'Failed to invite user',
        code: error.code || 'INVITE_ERROR',
      },
    };
  }
}

app.http('invite-user', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'users/invite',
  handler: requireRole(['admin', 'owner'], inviteUserHandler),
});

