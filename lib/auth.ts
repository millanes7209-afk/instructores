import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/auth-constants';

export function isAdminAuthenticated() {
  return cookies().get(AUTH_COOKIE)?.value === '1';
}
