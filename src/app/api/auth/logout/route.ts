import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the site_auth cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      'site_auth=',
      'HttpOnly',
      'SameSite=Lax',
      'Path=/',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT', // Expire immediately
      ...(isProduction ? ['Secure'] : [])
    ].join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Support GET request for logout (e.g., logout links)
  return POST(request);
}