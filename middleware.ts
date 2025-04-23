import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Create the nextIntl middleware with locale detection
const nextIntlMiddleware = createMiddleware({
  locales: ['en', 'am'],
  defaultLocale: 'am',
  localeDetection: true,
  localePrefix: 'as-needed' // This makes the locale prefix optional when it matches the default locale
});

// Export the middleware function
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle the root path by detecting the user's preferred locale
  if (pathname === '/') {
    // Get preferred language from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferredLocale = acceptLanguage.includes('am') ? 'am' : 'en';
    
    // Redirect to the preferred locale or default to 'am'
    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
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
