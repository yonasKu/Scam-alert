import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from 'limiter';

// Store limiters in memory - Note: In production with multiple instances,
// you would want to use Redis or similar for distributed rate limiting
const limiters = new Map<string, RateLimiter>();

// Exponential backoff configuration
const INITIAL_TOKENS = 5;         // Initial number of tokens
const WINDOW_MS = 60 * 1000;      // 1 minute window
const RETRY_AFTER_BASE = 60;      // Base seconds to wait
const MAX_BACKOFF = 3600;         // Max backoff in seconds (1 hour)

// IP-based rate limiting middleware for API routes
export async function rateLimitMiddleware(req: NextRequest, maxRequests = INITIAL_TOKENS, windowMs = WINDOW_MS) {
  // Get client IP
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!ip || ip === 'unknown') {
    return NextResponse.json(
      { error: 'Unable to determine client IP for rate limiting' },
      { status: 400 }
    );
  }

  // Get or create limiter for this IP
  if (!limiters.has(ip)) {
    limiters.set(ip, new RateLimiter({
      tokensPerInterval: maxRequests,
      interval: windowMs,
      fireImmediately: true
    }));
  }

  const limiter = limiters.get(ip)!;
  
  try {
    // Try to remove a token from the bucket
    const remainingRequests = await limiter.removeTokens(1);
    
    // Attach rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', maxRequests.toString());
    headers.set('X-RateLimit-Remaining', Math.floor(remainingRequests).toString());
    
    // Continue to the handler
    return null;
  } catch (error) {
    // Calculate exponential backoff
    const attempts = Math.floor((maxRequests - limiter.getTokensRemaining()) / maxRequests);
    const retryAfter = Math.min(
      RETRY_AFTER_BASE * Math.pow(2, attempts),
      MAX_BACKOFF
    );

    // Return 429 Too Many Requests with retry information
    const headers = new Headers();
    headers.set('Retry-After', retryAfter.toString());
    
    return NextResponse.json(
      { 
        error: 'rate_limit_exceeded',
        message: 'Too many requests, please try again later',
        retryAfter: retryAfter
      },
      { 
        status: 429,
        headers: headers
      }
    );
  }
}
