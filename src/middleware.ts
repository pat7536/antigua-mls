import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Routes that bypass site password protection
const isPublicRoute = createRouteMatcher([
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/favicon.ico',
  '/robots.txt'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Add no-index headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  
  // Skip site password check for public routes and Next.js internals
  if (isPublicRoute(req) || req.nextUrl.pathname.startsWith('/_next/')) {
    // Still apply Clerk middleware for protected routes
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
    return response;
  }

  // Check for site authentication cookie
  const siteAuth = req.cookies.get('site_auth');
  
  if (!siteAuth || siteAuth.value !== '1') {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Apply Clerk middleware for protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
