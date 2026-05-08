'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<void>;
  hasError: boolean;
  nextPath: string;
}

export default function LoginForm({ loginAction, hasError, nextPath }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    // El formulario se enviará al Server Action
  };

  return (
    <div className="premium-card p-8 md:p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Bienvenido</h1>
        <p className="text-slate-500">Inicia sesión en el panel de RateGym</p>
      </div>

      {hasError && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 text-red-700 p-4 text-sm font-medium animate-shake">
          ⚠️ Credenciales incorrectas. Intenta de nuevo.
        </div>
      )}

      <form action={loginAction} onSubmit={handleSubmit} className="space-y-6">
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
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>
    </div>
  );
}
