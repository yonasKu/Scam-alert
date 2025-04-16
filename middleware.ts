import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Create the nextIntl middleware
const nextIntlMiddleware = createMiddleware({
  locales: ['en', 'am'],
  defaultLocale: 'am'
});

// Export the middleware function
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle the root path specifically
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/am', request.url));
  }

  // For all other paths, use the nextIntl middleware
  return nextIntlMiddleware(request);
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    // Match the root path
    '/',
    // Match all paths that start with a locale prefix and have something after it
    '/(am|en)/:path*',
    // Exclude files with extensions and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]*$).*)'
  ]
};
