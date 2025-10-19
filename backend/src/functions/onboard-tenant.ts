/**
 * StratOS Platform - Onboard Tenant Function
 * 
 * Create new tenant and initialize resources
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { TenantService } from '../services/tenant.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';

const tenantService = new TenantService();

async function onboardTenantHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as {
      tenantName: string;
      domain: string;
      ownerEmail: string;
      ownerName: string;
      plan?: 'free' | 'starter' | 'pro' | 'enterprise';
    };

    // Validate input
    if (!body.tenantName || !body.domain || !body.ownerEmail || !body.ownerName) {
      throw new ValidationError('Tenant name, domain, owner email, and owner name are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.ownerEmail)) {
      throw new ValidationError('Invalid email address');
    }

    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
    if (!domainRegex.test(body.domain)) {
      throw new ValidationError('Invalid domain. Use lowercase letters, numbers, and hyphens only');
    }

    context.log(`Onboarding tenant: ${body.tenantName} (${body.domain})`);

    // Check if domain is already taken
    // In production, query to check domain uniqueness
    // For now, we'll skip this check

    // Create tenant
    const tenant = await tenantService.createTenant({
      name: body.tenantName,
      domain: body.domain,
      ownerEmail: body.ownerEmail,
      ownerName: body.ownerName,
      plan: body.plan || 'free',
    });

    // Track onboarding
    insights.trackEvent('TenantOnboarded', {
      tenantId: tenant.id,
      domain: tenant.domain,
      plan: tenant.plan,
    });

    // Generate setup instructions
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const loginUrl = `${frontendUrl}/login?tenant=${tenant.id}`;

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        message: 'Tenant created successfully',
        tenant: {
          id: tenant.id,
          name: tenant.name,
          domain: tenant.domain,
          plan: tenant.plan,
          status: tenant.status,
          createdAt: tenant.createdAt,
        },
        owner: {
          email: tenant.owner.email,
          name: tenant.owner.name,
        },
        quota: {
          monthlyQueries: tenant.settings.monthlyQueryLimit,
          storageGB: tenant.settings.storageQuotaGB,
        },
        setup: {
          loginUrl,
          nextSteps: [
            'Complete Azure AD B2C registration',
            'Log in to the platform',
            'Configure team settings',
            'Invite team members',
            'Start using AI agents',
          ],
        },
      },
    };

  } catch (error: any) {
    context.error('Onboard tenant error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/tenant/onboard',
    });

    return {
      status: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        error: error.message || 'Failed to onboard tenant',
        code: error.code || 'ONBOARD_ERROR',
      },
    };
  }
}

app.http('onboard-tenant', {
  methods: ['POST'],
  authLevel: 'anonymous', // Public for initial signup
  route: 'tenant/onboard',
  handler: onboardTenantHandler,
});

