# Authentication Migration Guide

## Overview

This guide explains how to migrate existing Azure Functions to use the enhanced authentication and multi-tenancy features.

## What's Changed

### Before (Phase 1)
- Basic JWT validation in each function
- Manual tenant checking
- No role-based access control
- No usage quota enforcement

### After (Phase 2)
- **Centralized auth middleware** (`requireAuth`, `requireRole`)
- **Tenant service** for quota and user management
- **Token caching** for better performance
- **Automatic RBAC** enforcement
- **Usage tracking** and quota enforcement

## Migration Steps

### Step 1: Import New Utilities

```typescript
// Old imports
import { validateToken } from '../utils/auth';

// New imports
import { requireAuth, requireRole, AuthContext } from '../utils/auth';
import { TenantService } from '../services/tenant.service';

const tenantService = new TenantService();
```

### Step 2: Update Function Signature

```typescript
// Old
async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const user = validateToken(request); // Manual validation
  // ...
}

// New
async function handler(
  request: HttpRequest,
  context: AuthContext // Changed type
): Promise<HttpResponseInit> {
  const user = context.user!; // Already validated by middleware
  // ...
}
```

### Step 3: Add Tenant Checks

```typescript
async function handler(request: HttpRequest, context: AuthContext) {
  const user = context.user!;

  // 1. Check tenant is active
  const tenant = await tenantService.getTenant(user.tenantId);
  if (!tenant) {
    return {
      status: 404,
      jsonBody: { error: 'Tenant not found', code: 'TENANT_NOT_FOUND' },
    };
  }

  if (tenant.status !== 'active') {
    return {
      status: 403,
      jsonBody: { error: 'Tenant suspended', code: 'TENANT_SUSPENDED' },
    };
  }

  // 2. Check usage quota (for query endpoints)
  const hasQuota = await tenantService.checkUsageLimit(user.tenantId);
  if (!hasQuota) {
    return {
      status: 429,
      jsonBody: {
        error: 'Monthly quota exceeded',
        code: 'QUOTA_EXCEEDED',
        upgradeUrl: `${process.env.FRONTEND_URL}/upgrade`,
      },
    };
  }

  // ... rest of handler logic

  // 3. Increment usage at the end
  await tenantService.incrementUsage(user.tenantId, 'queries');

  return response;
}
```

### Step 4: Wrap Handler with Middleware

```typescript
// Old
app.http('function-name', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler,
});

// New - Basic auth
app.http('function-name', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: requireAuth(handler),
});

// New - Role-based auth
app.http('admin-function', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: requireRole(['admin', 'owner'], handler),
});
```

## Example: Migrating chat.ts

### Before

```typescript
async function chatHandler(request: HttpRequest, context: InvocationContext) {
  try {
    const user = validateToken(request);
    
    const tenant = await cosmos.getDocument<Tenant>('tenants', user.tenantId, user.tenantId);
    if (!tenant) {
      throw new ValidationError('Tenant not found');
    }

    if (tenant.usage.requestsThisMonth >= tenant.quota.maxRequestsPerMonth) {
      throw new RateLimitError('Monthly quota exceeded');
    }

    // ... rest of logic

    // Manual usage update
    tenant.usage.requestsThisMonth += 1;
    await cosmos.updateDocument('tenants', tenant);
  } catch (error) {
    // Error handling
  }
}

app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: chatHandler,
});
```

### After

```typescript
import { requireAuth, AuthContext } from '../utils/auth';
import { TenantService } from '../services/tenant.service';

const tenantService = new TenantService();

async function chatHandler(request: HttpRequest, context: AuthContext) {
  const user = context.user!; // Already validated

  // Check tenant and quota
  const tenant = await tenantService.getTenant(user.tenantId);
  if (!tenant || tenant.status !== 'active') {
    return { status: 403, jsonBody: { error: 'Access denied' } };
  }

  const hasQuota = await tenantService.checkUsageLimit(user.tenantId);
  if (!hasQuota) {
    return { status: 429, jsonBody: { error: 'Quota exceeded' } };
  }

  // ... rest of logic

  // Automatic usage tracking
  await tenantService.incrementUsage(user.tenantId, 'queries');

  return response;
}

app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: requireAuth(chatHandler),
});
```

## Benefits of Migration

1. **Less Boilerplate**: No need to call `validateToken()` in every function
2. **Consistent Error Handling**: Automatic 401/403 responses
3. **Token Caching**: Better performance with 5-minute cache
4. **Easier RBAC**: Use `requireRole()` for admin endpoints
5. **Usage Tracking**: Centralized quota management
6. **Audit Trail**: All auth events logged to Application Insights

## Testing

After migration, test with:

```bash
# Valid token
curl -X POST http://localhost:7071/api/chat \
  -H "Authorization: Bearer VALID_TOKEN" \
  -d '{"message": "test"}'
# Expected: 200 OK

# No token
curl -X POST http://localhost:7071/api/chat \
  -d '{"message": "test"}'
# Expected: 401 Unauthorized

# Expired token
curl -X POST http://localhost:7071/api/chat \
  -H "Authorization: Bearer EXPIRED_TOKEN" \
  -d '{"message": "test"}'
# Expected: 401 with "Token has expired"

# Non-admin trying admin endpoint
curl -X POST http://localhost:7071/api/users/invite \
  -H "Authorization: Bearer MEMBER_TOKEN" \
  -d '{"email": "test@example.com", "role": "member"}'
# Expected: 403 Forbidden

# Quota exceeded
curl -X POST http://localhost:7071/api/chat \
  -H "Authorization: Bearer VALID_TOKEN" \
  -d '{"message": "test"}'
# Expected: 429 (if over quota)
```

## Migration Checklist

- [ ] Update imports
- [ ] Change function signature to use `AuthContext`
- [ ] Replace manual `validateToken()` with `context.user!`
- [ ] Add tenant status checks
- [ ] Add quota checks (for query endpoints)
- [ ] Add usage tracking
- [ ] Wrap handler with `requireAuth()` or `requireRole()`
- [ ] Test all auth scenarios
- [ ] Update error handling
- [ ] Remove old validation code

## Notes

- Existing functions will continue to work with basic auth
- Migration can be done gradually, function by function
- The new `requireAuth` wrapper is backward compatible
- All new functions should use the new pattern from the start

## Support

For questions or issues:
- Review `backend/src/utils/auth.ts` for middleware details
- Review `backend/src/services/tenant.service.ts` for tenant management
- Check `backend/PHASE2-COMPLETE.md` for full documentation

