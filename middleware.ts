import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { decrypt } from './lib/auth';
import { AUTH_COOKIE } from './lib/auth-constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Definir rutas protegidas
  const isProtectedRoute = pathname.startsWith('/estadisticas') || pathname.startsWith('/admin');
  if (!isProtectedRoute) return NextResponse.next();

  // 2. Obtener y verificar el token
  const sessionToken = request.cookies.get(AUTH_COOKIE)?.value;
  const session = sessionToken ? await decrypt(sessionToken) : null;

  // 3. Redirigir si no hay sesión válida
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/estadisticas/:path*', '/admin/:path*'],
};
