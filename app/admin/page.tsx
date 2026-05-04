import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export default async function AdminDashboard() {
  const session = await getSession();
  const isSuperAdmin = session?.rol === 'superadmin';

  // Obtener algunos conteos rápidos según el rol
  const gymFilter = !isSuperAdmin ? 'WHERE id = $1' : '';
  const gymParams = !isSuperAdmin ? [session?.gimnasioId] : [];

  const gymsCount = await query('SELECT count(*) FROM gimnasios');
  const instructorsCount = await query(
    `SELECT count(*) FROM instructores ${!isSuperAdmin ? 'WHERE gimnasio_id = $1' : ''}`,
    !isSuperAdmin ? [session?.gimnasioId] : []
  );
  const reviewsCount = await query(
    `SELECT count(*) FROM evaluaciones e 
     JOIN instructores i ON e.instructor_id = i.id 
     ${!isSuperAdmin ? 'WHERE i.gimnasio_id = $1' : ''}`,
    !isSuperAdmin ? [session?.gimnasioId] : []
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Bienvenido, {session?.username}
        </h1>
        <p className="text-slate-500">Aquí tienes un resumen de tu plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isSuperAdmin && (
          <div className="premium-card p-6">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Gimnasios</p>
            <p className="text-4xl font-black text-blue-600">{gymsCount.rows[0].count}</p>
          </div>
        )}
        
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
        <h2 className="text-2xl font-bold mb-2">Listo para crecer?</h2>
        <p className="text-blue-100 mb-6">
          {isSuperAdmin 
            ? 'Como SuperAdmin puedes agregar nuevos gimnasios y ver todas las estadísticas globales.'
            : 'Como Administrador puedes gestionar tus disciplinas y ver el desempeño de tus instructores.'}
        </p>
        <div className="flex gap-4">
           {isSuperAdmin ? (
             <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm">
               Crear Gimnasio
             </button>
           ) : (
             <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm">
               Gestionar Instructores
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
