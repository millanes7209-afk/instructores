import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// Relative import avoids pulling Next path-resolution helpers into Edge bundle.
import { AUTH_COOKIE } from './lib/auth-constants';

export function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/estadisticas');
  if (!isProtectedRoute) return NextResponse.next();

  const isLoggedIn = request.cookies.get(AUTH_COOKIE)?.value === '1';
  if (isLoggedIn) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/estadisticas/:path*'],
};
