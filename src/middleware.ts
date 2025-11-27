import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware protects admin routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Temporarily disable middleware for debugging
  console.log('Middleware checking path:', pathname);
  
  // Check if the path is an admin route (except login and forgot password)
  if (pathname.startsWith('/admin') && 
      !pathname.startsWith('/admin/login') && 
      !pathname.startsWith('/admin/forgot-password')) {
    
    console.log('Admin route detected, checking token...');
    
    // Check for admin token in cookies or headers
    const token = request.cookies.get('adminToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    console.log('Token found:', !!token);

    // If no token, redirect to login
    if (!token) {
      console.log('No token, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log('Token found, allowing access');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
