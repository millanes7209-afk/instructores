'use client';

import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function ChartsClient({
  disciplinas,
  instructores,
  evaluaciones,
}: {
  disciplinas: any[];
  instructores: any[];
  evaluaciones: any[];
}) {
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<string>('');

  const selectedDisciplina = disciplinas.find(d => d.id.toString() === selectedDisciplinaId);
  const instructoresDisciplina = instructores.filter(i => i.disciplina_id.toString() === selectedDisciplinaId);

  const getInstructorStats = (instructorId: string) => {
    const instructorEvaluaciones = evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString());
    
    if (instructorEvaluaciones.length === 0) {
      return { total: 0, puntualidad: 0, satisfaccion: 0, calificacion: 0 };
    }

    const total = instructorEvaluaciones.length;
    const puntualidad = instructorEvaluaciones.reduce((sum, e) => sum + Number(e.puntualidad), 0) / total;
    const satisfaccion = instructorEvaluaciones.reduce((sum, e) => sum + Number(e.satisfaccion), 0) / total;
    const calificacion = instructorEvaluaciones.reduce((sum, e) => sum + Number(e.calificacion_instructor), 0) / total;

    return {
      total,
      puntualidad: Math.round(puntualidad * 100) / 100,
      satisfaccion: Math.round(satisfaccion * 100) / 100,
      calificacion: Math.round(calificacion * 100) / 100
    };
  };

  const createChartData = (instructorId: string) => {
    return {
      satisfaccion: {
        labels: ['Muy Insatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'Muy Satisfecho'],
        datasets: [{
          label: 'Satisfacción',
          data: [
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.satisfaccion) === 1).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.satisfaccion) === 2).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.satisfaccion) === 3).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.satisfaccion) === 4).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.satisfaccion) === 5).length,
          ],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
          borderWidth: 0
        }]
      },
      calificacion: {
        labels: ['1 Estrella', '2 Estrellas', '3 Estrellas', '4 Estrellas', '5 Estrellas'],
        datasets: [{
          label: 'Cantidad de Votos',
          data: [
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.calificacion_instructor) === 1).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.calificacion_instructor) === 2).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.calificacion_instructor) === 3).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.calificacion_instructor) === 4).length,
            evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.calificacion_instructor) === 5).length,
          ],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
          borderWidth: 0
        }]
      },
      puntualidad: {
        labels: ['Siempre tarde', 'A veces tarde', 'Puntual', 'Bueno', 'Excelente'],
        datasets: [{
          label: 'Porcentaje',
          data: [
            (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.puntualidad) === 1).length / (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString()).length || 1)) * 100 || 0,
            (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.puntualidad) === 2).length / (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString()).length || 1)) * 100 || 0,
            (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.puntualidad) === 3).length / (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString()).length || 1)) * 100 || 0,
            (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.puntualidad) === 4).length / (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString()).length || 1)) * 100 || 0,
            (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString() && Number(e.puntualidad) === 5).length / (evaluaciones.filter(e => e.instructor_id.toString() === instructorId.toString()).length || 1)) * 100 || 0,
          ],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
          borderWidth: 0
        }]
      }
    };
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
          Estadísticas de Evaluación
        </h1>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          Selecciona una disciplina para visualizar los gráficos de rendimiento detallados de cada instructor.
        </p>

        <select 
          className="w-full max-w-md mx-auto p-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium"
          onChange={(e) => setSelectedDisciplinaId(e.target.value)}
          value={selectedDisciplinaId}
        >
          <option value="">Selecciona una disciplina</option>
          {disciplinas.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedDisciplina && (
        <div className="space-y-8">
          {instructoresDisciplina.map((instructor) => {
            const stats = getInstructorStats(instructor.id);
            const chartData = createChartData(instructor.id);

            return (
              <div key={instructor.id} className="premium-card p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-2xl font-black text-white">{instructor.iniciales}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{instructor.nombre}</h3>
                    <p className="text-slate-500 font-medium">
                      {stats.total} evaluaciones • Promedio General: <span className="text-blue-600 font-bold">{((stats.puntualidad + stats.satisfaccion + stats.calificacion) / 3).toFixed(1)}/5.0</span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h5 className="text-center font-bold text-slate-700 mb-4">Satisfacción</h5>
                    <div className="h-64">
                      <Pie data={chartData.satisfaccion} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } }
                      }} />
                    </div>
                  </div>

                  <div>
                    <h5 className="text-center font-bold text-slate-700 mb-4">Calificación General</h5>
                    <div className="h-64">
                      <Bar data={chartData.calificacion} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, title: { display: true, text: 'Votos' } },
                        }
                      }} />
                    </div>
                  </div>

                  <div>
                    <h5 className="text-center font-bold text-slate-700 mb-4">Puntualidad</h5>
                    <div className="h-64">
                      <Bar data={chartData.puntualidad} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { beginAtZero: true, max: 100, title: { display: true, text: 'Porcentaje (%)' } }
                        }
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {instructoresDisciplina.length === 0 && (
            <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-lg">No hay instructores asignados a esta disciplina.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
