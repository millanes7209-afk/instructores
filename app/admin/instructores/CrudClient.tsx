'use client';

import { useState } from 'react';
import { createInstructor, updateInstructor, deleteInstructor } from '../actions';

export default function InstructoresCrudClient({ 
  initialData, 
  todasDisciplinas 
}: { 
  initialData: any[]; 
  todasDisciplinas: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', iniciales: '', disciplinas: [] as string[] });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ nombre: '', iniciales: '', disciplinas: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    const discIds = Array.isArray(item.disciplina_ids) 
      ? item.disciplina_ids.map((id: any) => String(id)) 
      : [];
    setFormData({ 
      nombre: item.nombre, 
      iniciales: item.iniciales || '', 
      disciplinas: discIds 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este instructor? Se borrarán sus evaluaciones y relaciones.')) {
      await deleteInstructor(id);
    }
  };

  const toggleDisciplina = (id: string) => {
    setFormData(prev => ({
      ...prev,
      disciplinas: prev.disciplinas.includes(id) 
        ? prev.disciplinas.filter(d => d !== id) 
        : [...prev.disciplinas, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('iniciales', formData.iniciales);
    formData.disciplinas.forEach(id => data.append('disciplinas', id));

    if (editingId) {
      await updateInstructor(editingId, data);
    } else {
      await createInstructor(data);
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Instructores</h1>
          <p className="text-slate-500">Administra los instructores de Nivel Fitness Club</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all"
        >
          + Nuevo Instructor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-semibold text-slate-600">Instructor</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Iniciales</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Disciplinas</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {initialData.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{i.nombre}</td>
                  <td className="p-4 text-slate-500">
                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {i.iniciales}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {i.disciplinas && i.disciplinas.filter(Boolean).length > 0 
                      ? (
                        <div className="flex flex-wrap gap-1.5">
                          {i.disciplinas.filter(Boolean).map((d: string, idx: number) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                              {d}
                            </span>
                          ))}
                        </div>
                      )
                      : <span className="text-slate-400 italic">Ninguna asignada</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenEdit(i)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Editar</button>
                    <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
              {initialData.length === 0 && (
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Editar Instructor' : 'Nuevo Instructor'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Carlos Rojas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Iniciales</label>
                <input 
                  type="text" 
                  required 
                  maxLength={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.iniciales}
                  onChange={(e) => setFormData({...formData, iniciales: e.target.value.toUpperCase()})}
                  placeholder="CR"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Disciplinas</label>
                <div className="flex flex-wrap gap-2">
                  {todasDisciplinas.map((d) => {
                    const isSelected = formData.disciplinas.includes(String(d.id));
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDisciplina(String(d.id))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {d.nombre}
                      </button>
                    );
                  })}
                  {todasDisciplinas.length === 0 && (
                    <p className="text-sm text-slate-400 italic">Primero crea disciplinas.</p>
                  )}
                </div>
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
