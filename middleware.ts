import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Redirect to the login page if the user is not logged in and tries to access the root path
  if (!token && pathname !== '/login' && pathname !== '/register' && pathname !== '/forgotpassword') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login') {
    request.nextUrl.pathname = '/auth/login';
    return NextResponse.rewrite(request.nextUrl);
  }

  // Serve the content from /auth/register while keeping the browser address as /register
  if (pathname === '/register') {
    request.nextUrl.pathname = '/auth/register';
    return NextResponse.rewrite(request.nextUrl);
  }

  if (pathname === '/forgotpassword') {
    request.nextUrl.pathname = '/auth/forgotpassword';
    return NextResponse.rewrite(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/analytics', '/finance', '/crypto', '/apps/:path*'],
};
