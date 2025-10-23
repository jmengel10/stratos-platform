/**
 * StratOS Platform - Accept Invite Function
 * 
 * Allow users to accept invitations and join tenants
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { TenantService } from '../services/tenant.service';
import { CosmosService } from '../services/cosmos.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';

const tenantService = new TenantService();
const cosmosService = new CosmosService();

async function acceptInviteHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as {
      token: string;
      name: string;
      b2cUserId?: string;
    };

    // Validate input
    if (!body.token || !body.name) {
      throw new ValidationError('Token and name are required');
    }

    context.log(`Accepting invite with token: ${body.token.substring(0, 8)}...`);

    // Find user by invite token
    const result = await cosmosService.queryDocuments<any>(
      'users',
      {
        query: 'SELECT * FROM c WHERE c.inviteToken = @token AND c.status = @status',
        parameters: [
          { name: '@token', value: body.token },
          { name: '@status', value: 'invited' },
        ],
      }
    );

    if (result.items.length === 0) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Invalid or expired invite token',
          code: 'INVALID_TOKEN',
        },
      };
    }

    const user = result.items[0];

    // Check if invite has expired
    if (user.inviteExpiry && new Date(user.inviteExpiry) < new Date()) {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Invite has expired',
          code: 'EXPIRED_INVITE',
        },
      };
    }

    // Update user status
    const updated = await tenantService.updateUser(user.id, user.tenantId, {
      name: body.name,
      status: 'active',
      inviteToken: undefined, // Remove token
      inviteExpiry: undefined,
      lastLoginAt: new Date().toISOString(),
    });

    // Track event
    insights.trackEvent('InviteAccepted', {
      userId: updated.id,
      tenantId: updated.tenantId,
      email: updated.email,
    });

    // Get tenant info
    const tenant = await tenantService.getTenant(updated.tenantId);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        message: 'Invite accepted successfully',
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          roles: updated.roles,
        },
        tenant: {
          id: tenant?.id,
          name: tenant?.name,
          plan: tenant?.plan,
        },
        loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
      },
    };

  } catch (error: any) {
    context.error('Accept invite error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/users/accept-invite',
    });

    return {
      status: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        error: error.message || 'Failed to accept invite',
        code: error.code || 'ACCEPT_ERROR',
      },
    };
  }
}

app.http('accept-invite', {
  methods: ['POST'],
  authLevel: 'anonymous', // Public endpoint
  route: 'users/accept-invite',
  handler: acceptInviteHandler,
});

