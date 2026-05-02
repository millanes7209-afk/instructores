import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth-constants';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
