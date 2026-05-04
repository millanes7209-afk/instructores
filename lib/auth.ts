import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { AUTH_COOKIE, JWT_SECRET } from './auth-constants';

const secret = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: number;
  gimnasioId: number | null;
  rol: string;
  username: string;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, secret, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const session = cookies().get(AUTH_COOKIE)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function isAdmin() {
  const session = await getSession();
  return !!session;
}

export async function isSuperAdmin() {
  const session = await getSession();
  return session?.rol === 'superadmin';
}
