import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDisciplinasPage() {
  const result = await query('SELECT * FROM disciplinas ORDER BY nombre ASC');
  const disciplinas = result.rows;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Disciplinas</h1>
          <p className="text-slate-500">Administra las clases y disciplinas de Nivel Fitness Club</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all">
          + Nueva Disciplina
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-600">Icono</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Nombre</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Slug</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((d) => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-2xl">{d.icono}</td>
                <td className="p-4 font-medium text-slate-900">{d.nombre}</td>
                <td className="p-4 text-slate-500 text-sm">{d.slug}</td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {disciplinas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No hay disciplinas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
