import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect to the login page if the user is not logged in and tries to access the root path
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Serve the content from /auth/register while keeping the browser address as /register
  if (pathname === '/register') {
    request.nextUrl.pathname = '/auth/register';
    return NextResponse.rewrite(request.nextUrl);
  }

  return NextResponse.next();
}
