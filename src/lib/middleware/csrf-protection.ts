import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// CSRF token configuration
const CSRF_TOKEN_COOKIE = 'X-CSRF-Token';
const CSRF_HEADER = 'x-csrf-token';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generates a new CSRF token and sets it in a cookie
 */
export function generateCsrfToken(): string {
  // Create a strong random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Set cookie with the token
  // Note: For server components and middleware, we need to get the cookie store first
  const cookieStore = cookies();
  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY_MS / 1000,
    path: '/'
  });
  
  return token;
}

/**
 * Validate CSRF token middleware for API routes
 * This validates that the token in the request header matches the one in the cookie
 */
export function validateCsrfToken(req: NextRequest): NextResponse | null {
  // Skip for GET requests as they should be idempotent
  if (req.method === 'GET') {
    return null;
  }
  
  // Get the token from the header
  const headerToken = req.headers.get(CSRF_HEADER);
  
  // Get the token from the cookie
  const cookieToken = req.cookies.get(CSRF_TOKEN_COOKIE)?.value;
  
  // If either token is missing, reject the request
  if (!headerToken || !cookieToken) {
    return NextResponse.json(
      { error: 'CSRF token missing' },
      { status: 403 }
    );
  }
  
  // If tokens don't match, reject the request
  if (headerToken !== cookieToken) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  // CSRF validation passed
  return null;
}

/**
 * Create a CSRF-protected fetch function for use in client components
 */
export function createCsrfFetch(token: string) {
  return async (url: string, options: RequestInit = {}) => {
    // Add CSRF token to the headers
    const headers = new Headers(options.headers || {});
    headers.set(CSRF_HEADER, token);
    
    // Create the fetch request with the CSRF token
    return fetch(url, {
      ...options,
      headers
    });
  };
}
