import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Dumbbell, Users, BarChart3, LogOut } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login?next=/admin');
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
        <div className="p-8">
          <Link href="/admin" className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg leading-none">R</span>
            </div>
            RateGym <span className="text-slate-300 font-medium">|</span> <span className="text-slate-800 font-bold text-lg">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Gestión Principal</p>
          
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group">
            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            Dashboard
          </Link>
          
          <Link href="/admin/disciplinas" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group">
            <Dumbbell className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            Disciplinas
          </Link>
          
          <Link href="/admin/instructores" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group">
            <Users className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            Instructores
          </Link>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <p className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Reportes</p>
            <Link href="/estadisticas" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group">
              <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              Estadísticas
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white shadow-sm">
                {session.nombre ? session.nombre[0].toUpperCase() : 'S'}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{session.nombre || 'Sergio'}</p>
              <p className="text-xs text-slate-500 font-medium">Administrador</p>
            </div>
          </div>
          <form action="/logout" method="post">
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-600 font-semibold py-2.5 rounded-xl transition-all text-sm">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 max-h-screen overflow-y-auto bg-slate-50/50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:hidden sticky top-0 z-10 shadow-sm">
           <Link href="/admin" className="text-xl font-black text-blue-600 flex items-center gap-2">
             <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
               <span className="text-white text-xs leading-none">R</span>
             </div>
             RateGym
           </Link>
        </header>
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

