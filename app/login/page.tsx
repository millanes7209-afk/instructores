import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE } from '@/lib/auth-constants';
import { query } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import bcrypt from 'bcryptjs';

interface LoginPageProps {
  searchParams?: {
    error?: string;
    next?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = searchParams?.next || '/estadisticas';
  const hasError = searchParams?.error === '1';

  async function loginAction(formData: FormData) {
    'use server';

    const username = String(formData.get('user') ?? '');
    const password = String(formData.get('password') ?? '');
    const next = String(formData.get('next') ?? '/estadisticas');

    try {
      // 1. Buscar usuario en la base de datos
      const result = await query(
        'SELECT * FROM usuarios WHERE username = $1 LIMIT 1',
        [username]
      );

      const user = result.rows[0] as any;

      // 2. Verificar contraseña
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
      }

      // 3. Crear sesión JWT
      const sessionToken = await encrypt({
        userId: user.id,
        gimnasioId: user.gimnasio_id,
        rol: user.rol,
        username: user.username,
      });

      // 4. Guardar en cookie
      cookies().set(AUTH_COOKIE, sessionToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 horas
      });

      redirect(next);
    } catch (error) {
      if ((error as any).digest?.startsWith('NEXT_REDIRECT')) throw error;
      console.error('Login error:', error);
      redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="premium-card p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Bienvenido</h1>
            <p className="text-slate-500">Inicia sesión en el panel de RateGym</p>
          </div>

          {hasError && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 text-red-700 p-4 text-sm font-medium">
              ⚠️ Credenciales incorrectas. Intenta de nuevo.
            </div>
          )}

          <form action={loginAction} className="space-y-6">
            <input type="hidden" name="next" value={nextPath} />

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Usuario</label>
              <input
                name="user"
                type="text"
                required
                placeholder="tu_usuario"
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Clave</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 shadow-xl shadow-blue-600/20"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

