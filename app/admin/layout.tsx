import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login?next=/admin');
  }

  const isSuperAdmin = session.rol === 'superadmin';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 glass-header border-r border-slate-200 hidden md:block">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-black text-blue-600 tracking-tighter">
            RateGym <span className="text-slate-400 font-normal">Admin</span>
          </Link>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          <Link href="/admin" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
            📊 Dashboard
          </Link>
          
          {isSuperAdmin && (
            <Link href="/admin/gimnasios" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
              🏢 Gimnasios
            </Link>
          )}
          
          <Link href="/admin/disciplinas" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
            🥋 Disciplinas
          </Link>
          
          <Link href="/admin/instructores" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
            👤 Instructores
          </Link>

          <Link href="/estadisticas" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
            📈 Ver Estadísticas
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">
                {session.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{session.username}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{session.rol}</p>
            </div>
          </div>
          <form action="/logout" method="post">
            <button type="submit" className="w-full btn-secondary py-2 text-xs">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="h-16 glass-header flex items-center px-8 md:hidden">
           {/* Mobile Header simple */}
           <Link href="/admin" className="text-xl font-black text-blue-600">RateGym</Link>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
