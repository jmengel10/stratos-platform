import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  adminMaxRequests: 1000, // higher limit for admin endpoints
  skipSuccessfulRequests: false,
  skipFailedRequests: false
};

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

function isRateLimited(key: string, isAdmin: boolean = false): boolean {
  const now = Date.now();
  const limit = isAdmin ? RATE_LIMIT_CONFIG.adminMaxRequests : RATE_LIMIT_CONFIG.maxRequests;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return false;
  }
  
  if (current.count >= limit) {
    return true;
  }
  
  current.count++;
  return false;
}

function isAdminEndpoint(pathname: string): boolean {
  return pathname.startsWith('/api/admin/');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only apply rate limiting to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const key = getRateLimitKey(request);
  const isAdmin = isAdminEndpoint(pathname);
  
  if (isRateLimited(key, isAdmin)) {
    return NextResponse.json(
      { 
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000).toString(),
          'X-RateLimit-Limit': (isAdmin ? RATE_LIMIT_CONFIG.adminMaxRequests : RATE_LIMIT_CONFIG.maxRequests).toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs).toISOString()
        }
      }
    );
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://nice-coast-09695130f.3.azurestaticapps.net');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

