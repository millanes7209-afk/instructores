import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { Users, Star, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getSession();

  const instructorsCount = await query('SELECT count(*) FROM instructores');
  const reviewsCount = await query('SELECT count(*) FROM evaluaciones');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Panel de Control
        </h1>
        <p className="text-lg text-slate-500 font-medium">Hola {session?.nombre || 'Sergio'}, gestiona el rendimiento de tu gimnasio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="premium-card p-6 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-blue-50 opacity-50 group-hover:scale-110 transition-transform">
            <Users className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Instructores</p>
            <p className="text-5xl font-black text-slate-900">{instructorsCount.rows[0].count}</p>
          </div>
        </div>

        <div className="premium-card p-6 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-orange-50 opacity-50 group-hover:scale-110 transition-transform">
            <Star className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Evaluaciones Totales</p>
            <p className="text-5xl font-black text-slate-900">{reviewsCount.rows[0].count}</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 shadow-2xl shadow-blue-900/20">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-white">Resumen Semanal</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Es el momento perfecto para revisar el desempeño de tus instructores. Configura tus disciplinas y asegúrate de que todos estén listos para recibir feedback.
          </p>
          <div className="flex flex-wrap gap-4">
             <Link href="/admin/instructores" className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-lg">
               Gestionar Instructores
               <ChevronRight className="w-5 h-5" />
             </Link>
             <Link href="/admin/disciplinas" className="bg-blue-700/50 backdrop-blur-sm border border-blue-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
               Ver Disciplinas
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

