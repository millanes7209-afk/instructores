import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminInstructoresPage() {
  const result = await query(`
    SELECT i.*, 
           array_agg(d.nombre) as disciplinas
    FROM instructores i
    LEFT JOIN instructor_disciplinas id ON i.id = id.instructor_id
    LEFT JOIN disciplinas d ON d.id = id.disciplina_id
    GROUP BY i.id
    ORDER BY i.nombre ASC
  `);
  const instructores = result.rows;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Instructores</h1>
          <p className="text-slate-500">Administra los instructores de Nivel Fitness Club</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all">
          + Nuevo Instructor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-600">Instructor</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Iniciales</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Disciplinas</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {instructores.map((i) => (
              <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{i.nombre}</td>
                <td className="p-4 text-slate-500">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                    {i.iniciales}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">
                  {i.disciplinas && i.disciplinas.filter(Boolean).length > 0 
                    ? i.disciplinas.filter(Boolean).join(', ') 
                    : <span className="text-slate-400 italic">Ninguna asignada</span>}
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {instructores.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No hay instructores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
