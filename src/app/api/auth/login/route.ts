import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const sitePassword = process.env.SITE_PASSWORD;
    
    // Debug logging
    console.log('Received password:', password);
    console.log('Expected password:', sitePassword);
    console.log('Password lengths - received:', password?.length, 'expected:', sitePassword?.length);
    console.log('Passwords match:', password === sitePassword);
    
    if (!sitePassword) {
      console.error('SITE_PASSWORD environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password !== sitePassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create response with success message
    const response = NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );

    // Set secure HttpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      'site_auth=1',
      'HttpOnly',
      'SameSite=Lax',
      'Path=/',
      'Max-Age=86400', // 24 hours
      ...(isProduction ? ['Secure'] : [])
    ].join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}