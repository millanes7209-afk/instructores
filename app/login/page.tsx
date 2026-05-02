import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE } from '@/lib/auth-constants';

interface LoginPageProps {
  searchParams?: {
    error?: string;
    next?: string;
  };
}

const ADMIN_USER = process.env.ADMIN_USER ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = searchParams?.next || '/estadisticas';
  const hasError = searchParams?.error === '1';

  async function loginAction(formData: FormData) {
    'use server';

    const user = String(formData.get('user') ?? '');
    const password = String(formData.get('password') ?? '');
    const next = String(formData.get('next') ?? '/estadisticas');

    if (user !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
    }

    cookies().set(AUTH_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    redirect(next);
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
        <p className="text-gray-600 mb-6">Inicia sesion para ver estadisticas.</p>

        {hasError && (
          <p className="mb-4 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
            Usuario o clave incorrectos.
          </p>
        )}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              name="user"
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clave</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
