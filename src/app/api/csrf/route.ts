import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/middleware/csrf-protection';

/**
 * GET endpoint to generate and set a CSRF token
 * This endpoint sets a cookie and returns the token that should be included in subsequent requests
 */
export async function GET(req: NextRequest) {
  try {
    // Generate a new CSRF token and set it in a cookie
    const token = generateCsrfToken();
    
    // Return the token to the client
    return NextResponse.json({ token, success: true });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
