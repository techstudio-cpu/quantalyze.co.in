import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Currently we don't enforce any route-level auth in middleware.
// Admin access is handled inside the /admin page and via API auth.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
