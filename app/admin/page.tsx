import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export default async function AdminDashboard() {
  const session = await getSession();

  const instructorsCount = await query('SELECT count(*) FROM instructores');
  const reviewsCount = await query('SELECT count(*) FROM evaluaciones');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Panel de Control
        </h1>
        <p className="text-slate-500">Hola Sergio, gestiona los instructores de tu gimnasio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="premium-card p-6">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Instructores</p>
          <p className="text-4xl font-black text-blue-600">{instructoresCount.rows[0].count}</p>
        </div>

        <div className="premium-card p-6">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Evaluaciones Totales</p>
          <p className="text-4xl font-black text-blue-600">{reviewsCount.rows[0].count}</p>
        </div>
      </div>

      <div className="premium-card p-8 bg-blue-600 text-white border-none shadow-blue-200">
        <h2 className="text-2xl font-bold mb-2">Resumen Semanal</h2>
        <p className="text-blue-100 mb-6">
          Gestiona tus disciplinas y revisa el desempeño de tus instructores de forma sencilla.
        </p>
        <div className="flex gap-4">
             <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm">
               Gestionar Instructores
             </button>
        </div>
      </div>
    </div>
  );
}
