/**
 * StratOS Platform - Authentication Utilities
 * 
 * Enhanced JWT validation with JWKS, caching, and RBAC
 */

import * as jwt from 'jsonwebtoken';
import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { AuthenticationError, AuthorizationError } from '../models';

// Token cache (in production, use Redis)
const tokenCache = new Map<string, { user: AuthenticatedUser; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface AuthenticatedUser {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  roles: string[];
  plan: string;
}

export interface AuthContext extends InvocationContext {
  user?: AuthenticatedUser;
}

/**
 * Extract and validate JWT token from request with caching
 * 
 * @param request - HTTP request
 * @returns Decoded user
 */
export function validateToken(request: HttpRequest): AuthenticatedUser {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  // Check cache first
  const cached = tokenCache.get(token);
  if (cached && cached.expiry > Date.now()) {
    return cached.user;
  }

  try {
    // For Azure AD B2C, in production you'd verify against JWKS endpoint
    // For now, we'll use JWT_SECRET for development
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as any;

    // Extract user information from B2C token claims
    const user: AuthenticatedUser = {
      userId: decoded.sub || decoded.oid || decoded.userId,
      tenantId: decoded.extension_TenantId || decoded.tenantId,
      email: decoded.emails?.[0] || decoded.email || '',
      name: decoded.name || decoded.given_name || '',
      roles: decoded.extension_Roles || decoded.roles || ['member'],
      plan: decoded.extension_Plan || decoded.plan || 'free',
    };

    // Validate required fields
    if (!user.userId || !user.tenantId) {
      throw new AuthenticationError('Invalid token payload: missing userId or tenantId');
    }

    // Cache the validated token
    tokenCache.set(token, {
      user,
      expiry: Date.now() + CACHE_TTL,
    });

    return user;

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }
    throw error;
  }
}

/**
 * Higher-order function to require authentication on Azure Function
 * 
 * @param handler - Function handler
 * @returns Wrapped handler with auth
 */
export function requireAuth(
  handler: (request: HttpRequest, context: AuthContext) => Promise<HttpResponseInit>
) {
  return async (
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const user = validateToken(request);
      
      // Attach user to context
      (context as AuthContext).user = user;

      // Call original handler
      return await handler(request, context as AuthContext);
    } catch (error: any) {
      if (error instanceof AuthenticationError) {
        return {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          jsonBody: {
            error: error.message,
            code: 'AUTHENTICATION_FAILED',
          },
        };
      }

      // Re-throw other errors
      throw error;
    }
  };
}

/**
 * Higher-order function to require specific roles
 * 
 * @param roles - Required roles (OR logic)
 * @param handler - Function handler
 * @returns Wrapped handler with role check
 */
export function requireRole(
  roles: string[],
  handler: (request: HttpRequest, context: AuthContext) => Promise<HttpResponseInit>
) {
  return requireAuth(async (request, context) => {
    const user = context.user!;

    // Check if user has any of the required roles
    const hasRole = roles.some(role => user.roles.includes(role));

    if (!hasRole) {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          error: 'Insufficient permissions',
          code: 'FORBIDDEN',
          required: roles,
        },
      };
    }

    return await handler(request, context);
  });
}

/**
 * Extract tenant ID from request (from auth or query param)
 * 
 * @param request - HTTP request
 * @returns Tenant ID
 */
export function extractTenantId(request: HttpRequest): string {
  try {
    const user = validateToken(request);
    return user.tenantId;
  } catch {
    // Fallback to query param for public endpoints
    return request.query.get('tenantId') || '';
  }
}

/**
 * Check if user is admin
 * 
 * @param user - Authenticated user
 * @returns True if admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.roles.includes('admin') || user.roles.includes('owner');
}

/**
 * Check if user can access a resource
 * 
 * @param user - Authenticated user
 * @param resourceTenantId - Tenant ID of the resource
 * @returns True if authorized
 */
export function canAccessResource(
  user: AuthenticatedUser,
  resourceTenantId: string
): boolean {
  return user.tenantId === resourceTenantId;
}

/**
 * Extract user from request (without throwing errors)
 * 
 * @param request - HTTP request
 * @returns User or null
 */
export function extractUser(request: HttpRequest): AuthenticatedUser | null {
  try {
    return validateToken(request);
  } catch {
    return null;
  }
}

/**
 * Clean expired tokens from cache (call periodically)
 */
export function cleanTokenCache(): void {
  const now = Date.now();
  for (const [token, cached] of tokenCache.entries()) {
    if (cached.expiry <= now) {
      tokenCache.delete(token);
    }
  }
}

// Clean cache every 10 minutes
setInterval(cleanTokenCache, 10 * 60 * 1000);

