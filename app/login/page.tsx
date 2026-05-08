import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE } from '@/lib/auth-constants';
import { query } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import LoginForm from './LoginForm';

interface LoginPageProps {
  searchParams?: {
    error?: string;
    next?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = searchParams?.next || '/admin/estadisticas';
  const hasError = searchParams?.error === '1';

  async function loginAction(formData: FormData) {
    'use server';

    const username = String(formData.get('user') ?? '');
    const password = String(formData.get('password') ?? '');
    const next = String(formData.get('next') ?? '/admin/estadisticas');

    let success = false;
    try {
      const result = await query(
        'SELECT * FROM usuarios WHERE username = $1 LIMIT 1',
        [username]
      );

      const user = result.rows[0] as any;

      if (user && (await bcrypt.compare(password, user.password_hash))) {
        const sessionToken = await encrypt({
          userId: user.id,
          gimnasioId: user.gimnasio_id,
          rol: user.rol,
          username: user.username,
        });

        cookies().set(AUTH_COOKIE, sessionToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 8, // 8 horas
        });
        success = true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }

    if (success) {
      redirect(next);
    } else {
      redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm 
          loginAction={loginAction} 
          hasError={hasError} 
          nextPath={nextPath} 
        />
      </div>
    </div>
  );
}

