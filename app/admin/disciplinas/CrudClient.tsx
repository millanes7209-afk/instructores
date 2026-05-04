'use client';

import { useState } from 'react';
import { createDisciplina, updateDisciplina, deleteDisciplina } from '../actions';

export default function DisciplinasCrudClient({ initialData }: { initialData: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', icono: '' });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '', icono: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ nombre: item.nombre, descripcion: item.descripcion || '', icono: item.icono });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta disciplina? Se borrarán sus relaciones.')) {
      await deleteDisciplina(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    data.append('icono', formData.icono);

    if (editingId) {
      await updateDisciplina(editingId, data);
    } else {
      await createDisciplina(data);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Disciplinas</h1>
          <p className="text-slate-500">Administra las clases y disciplinas de Nivel Fitness Club</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all"
        >
          + Nueva Disciplina
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-600">Icono</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Nombre</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Slug</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((d) => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-2xl">{d.icono}</td>
                <td className="p-4 font-medium text-slate-900">{d.nombre}</td>
                <td className="p-4 text-slate-500 text-sm">{d.slug}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenEdit(d)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Editar</button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {initialData.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No hay disciplinas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Editar Disciplina' : 'Nueva Disciplina'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Yoga"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-24"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Opcional..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icono (Emoji)</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.icono}
                  onChange={(e) => setFormData({...formData, icono: e.target.value})}
                  placeholder="🧘‍♀️"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
