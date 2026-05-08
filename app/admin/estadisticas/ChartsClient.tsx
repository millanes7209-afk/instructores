'use client';

import { useState, useMemo } from 'react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler 
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, 
  ArcElement, PointElement, LineElement, Filler
);

// Plugin para la aguja del velocímetro
const gaugeNeedle = {
  id: 'gaugeNeedle',
  afterDatasetDraw(chart: any, args: any, options: any) {
    const { ctx, chartArea: { width, height } } = chart;
    ctx.save();
    
    // Obtener promedio (de 1 a 5)
    const average = options.average || 3; 
    const percentage = (average - 1) / 4; 
    
    // Ángulo en radianes (Math.PI es izquierda, 2*Math.PI es derecha)
    const angle = Math.PI + (percentage * Math.PI); 
    
    const cx = chart.getDatasetMeta(0).data[0].x;
    const cy = chart.getDatasetMeta(0).data[0].y;
    
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -5);
    // Largo de la aguja relativo al gráfico
    ctx.lineTo(chart.getDatasetMeta(0).data[0].outerRadius - 20, 0);
    ctx.lineTo(0, 5);
    ctx.fillStyle = '#334155'; // slate-700
    ctx.fill();
    ctx.restore();

    // Círculo central
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.restore();
  }
};

export default function ChartsClient({
  disciplinas,
  instructores,
  evaluaciones,
  horarios,
}: {
  disciplinas: any[];
  instructores: any[];
  evaluaciones: any[];
  horarios: any[];
}) {
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<string>('');
  const [selectedSala, setSelectedSala] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const salas = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Sala 5'];

  // Filtrar instructores por disciplina
  const instructoresDeDisciplina = useMemo(() => {
    if (!selectedDisciplinaId) return [];
    const disciplinaNombre = disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase();
    
    // Un instructor pertenece a una disciplina si tiene un horario programado para ella
    return instructores.filter(i => 
      horarios.some(h => h.instructor_id === i.id && h.disciplina_nombre.toLowerCase() === disciplinaNombre)
    );
  }, [selectedDisciplinaId, instructores, horarios, disciplinas]);

  // Filtrar evaluaciones según los criterios seleccionados y el rango de tiempo
  const filteredEvaluaciones = useMemo(() => {
    return evaluaciones.filter(e => {
      if (!e) return false;
      
      const matchDisciplina = selectedDisciplinaId 
        ? e.disciplina_nombre?.toLowerCase() === disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase() 
        : true;
        
      const matchSala = selectedSala ? e.sala === selectedSala : true;
      const matchInstructor = selectedInstructorId ? Number(e.instructor_id) === selectedInstructorId : true;
      
      if (selectedTimeRange === 'all') return matchDisciplina && matchSala && matchInstructor;
      
      const voteDate = e.created_at ? new Date(e.created_at) : null;
      if (!voteDate || isNaN(voteDate.getTime())) return false;

      const now = new Date();
      const diffDays = (now.getTime() - voteDate.getTime()) / (1000 * 3600 * 24);
      
      const matchTime = selectedTimeRange === 'week' ? diffDays <= 7 : diffDays <= 30;
      
      return matchDisciplina && matchSala && matchTime && matchInstructor;
    });
  }, [evaluaciones, selectedDisciplinaId, selectedSala, selectedInstructorId, selectedTimeRange, disciplinas]);

  const getInstructorStats = (instructorId: number) => {
    const instructorEvaluaciones = filteredEvaluaciones.filter(e => Number(e.instructor_id) === Number(instructorId));
    
    if (instructorEvaluaciones.length === 0) {
      return { total: 0, puntualidad: 0, satisfaccion: 0, calificacion: 0 };
    }

    const total = instructorEvaluaciones.length;
    const puntualidad = instructorEvaluaciones.reduce((sum, e) => sum + Number(e.puntualidad || 0), 0) / total;
    const satisfaccion = instructorEvaluaciones.reduce((sum, e) => sum + Number(e.satisfaccion || 0), 0) / total;
    const calificacion = instructorEvaluaciones.reduce((sum, e) => sum + Number(e.calificacion_instructor || 0), 0) / total;

    return {
      total,
      puntualidad: Math.round(puntualidad * 100) / 100,
      satisfaccion: Math.round(satisfaccion * 100) / 100,
      calificacion: Math.round(calificacion * 100) / 100
    };
   const getClassBreakdown = (instructorId: number) => {
    const disciplinaNombre = disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase();
    const instructorHorarios = (horarios || []).filter(h => 
      Number(h.instructor_id) === Number(instructorId) && 
      (!disciplinaNombre || h.disciplina_nombre.toLowerCase() === disciplinaNombre)
    );
    
    return instructorHorarios.map(h => {
      const classEvs = filteredEvaluaciones.filter(e => Number(e.horario_id) === Number(h.id));
      const total = classEvs.length;
      
      const avgPuntualidad = total > 0 ? (classEvs.reduce((sum, e) => sum + Number(e.puntualidad || 0), 0) / total).toFixed(1) : 'N/A';
      const avgSatisfaccion = total > 0 ? (classEvs.reduce((sum, e) => sum + Number(e.satisfaccion || 0), 0) / total).toFixed(1) : 'N/A';
      const avgEstrellas = total > 0 ? (classEvs.reduce((sum, e) => sum + Number(e.calificacion_instructor || 0), 0) / total).toFixed(1) : 'N/A';
      
      return { ...h, total, avgPuntualidad, avgSatisfaccion, avgEstrellas };
    });
  };

  const createChartData = (instructorId: number) => {
    const instructorEvs = filteredEvaluaciones.filter(e => Number(e.instructor_id) === Number(instructorId));
    return {
      satisfaccion: {
        labels: ['Muy Insatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'Muy Satisfecho'],
        datasets: [{
          label: 'Niveles',
          data: [1, 1, 1, 1, 1],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
          borderWidth: 0,
          circumference: 180,
          rotation: -90,
          cutout: '75%'
        }]
      },
      calificacion: {
        labels: ['1 Estrella', '2 Estrellas', '3 Estrellas', '4 Estrellas', '5 Estrellas'],
        datasets: [{
          label: 'Votos',
          data: [
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 1).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 2).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 3).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 4).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 5).length,
          ],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
          borderWidth: 0
        }]
      },
      puntualidad: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
          label: 'Puntualidad',
          data: [
            instructorEvs.filter(e => Number(e.puntualidad) === 1).length,
            instructorEvs.filter(e => Number(e.puntualidad) === 2).length,
            instructorEvs.filter(e => Number(e.puntualidad) === 3).length,
            instructorEvs.filter(e => Number(e.puntualidad) === 4).length,
            instructorEvs.filter(e => Number(e.puntualidad) === 5).length,
          ],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.4
        }]
      }
    };
  };

  const diaNombre = (num: any) => {
    const n = Number(num);
    if (isNaN(n) || n < 1 || n > 7) return 'N/A';
    return ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][n-1];
  };

  const selectedInstructor = instructores.find(i => i.id === selectedInstructorId);
  const selectedDisciplina = disciplinas.find(d => d.id.toString() === selectedDisciplinaId);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Dashboard de Rendimiento
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Gestiona y visualiza el feedback por disciplina e instructor.
        </p>
      </div>

      {/* FILTROS GLOBALES (Siempre visibles si no estás en la pantalla inicial) */}
      {(selectedDisciplinaId || selectedInstructorId) && (
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
           <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (selectedInstructorId) setSelectedInstructorId(null);
                  else setSelectedDisciplinaId('');
                }}
                className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
              >
                ← Volver
              </button>
           </div>
           
           <div className="flex gap-4 items-center">
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setSelectedTimeRange('week')}
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${selectedTimeRange === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >Semana</button>
                <button 
                  onClick={() => setSelectedTimeRange('month')}
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${selectedTimeRange === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >Mes</button>
                <button 
                  onClick={() => setSelectedTimeRange('all')}
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${selectedTimeRange === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >Todo</button>
              </div>

              <select 
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-medium text-xs"
                onChange={(e) => setSelectedSala(e.target.value)}
                value={selectedSala}
              >
                <option value="">Todas las Salas</option>
                {salas.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
           </div>
        </div>
      )}

      <div className="space-y-10">
        {/* PANTALLA 1: SELECCIONAR DISCIPLINA */}
        {!selectedDisciplinaId && (
          <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <h4 className="text-lg font-bold text-slate-800 mb-6 text-center uppercase tracking-widest">
              Selecciona una Disciplina
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {disciplinas.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDisciplinaId(d.id.toString());
                    setSelectedInstructorId(null);
                  }}
                  className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400 transition-all text-center group active:scale-95"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {d.icono}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter text-slate-700 group-hover:text-blue-600">
                    {d.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PANTALLA 2: LISTA DE INSTRUCTORES (Solo si disciplina seleccionada y NO instructor) */}
        {selectedDisciplinaId && !selectedInstructorId && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">{selectedDisciplina?.icono}</span>
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                Instructores de {selectedDisciplina?.nombre}
              </h4>
              <p className="text-slate-500">Elige un instructor para ver su rendimiento específico</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {instructoresDeDisciplina.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstructorId(inst.id)}
                  className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-300">
                    <span className="text-2xl font-black text-blue-600 group-hover:text-white">{inst.iniciales}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600">
                    {inst.nombre}
                  </span>
                </button>
              ))}
              {instructoresDeDisciplina.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[3rem]">
                  No hay instructores registrados para esta disciplina.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANTALLA 3: ESTADÍSTICAS DEL INSTRUCTOR SELECCIONADO */}
        {selectedInstructor && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(() => {
              const stats = getInstructorStats(selectedInstructor.id);
              const chartData = createChartData(selectedInstructor.id);
              const classBreakdown = getClassBreakdown(selectedInstructor.id);

              return (
                <div className="premium-card p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-2xl font-black text-white">{selectedInstructor.iniciales}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{selectedInstructor.nombre}</h3>
                        <p className="text-slate-500 font-medium">
                          Disciplina: <span className="text-blue-600 font-bold">{selectedDisciplina?.nombre}</span> • {stats.total} votos
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Nota Media</p>
                      <p className="text-3xl font-black text-blue-600">{((stats.puntualidad + stats.satisfaccion + stats.calificacion) / 3).toFixed(1)}<span className="text-lg text-blue-300">/5.0</span></p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 mb-10">
                    {/* 1. Puntualidad */}
                    <div>
                      <h5 className="text-center font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Puntualidad</h5>
                      <div className="h-48">
                        <Line data={chartData.puntualidad} options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
                            x: { ticks: { font: { size: 10 } } }
                          }
                        }} />
                      </div>
                    </div>

                    {/* 2. Satisfacción */}
                    <div>
                      <h5 className="text-center font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Satisfacción</h5>
                      <div className="h-40 relative flex items-end justify-center">
                        <Doughnut 
                          data={chartData.satisfaccion} 
                          plugins={[gaugeNeedle]}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { 
                              legend: { display: false },
                              tooltip: { enabled: false },
                              // @ts-ignore
                              gaugeNeedle: { average: stats.satisfaccion || 1 }
                            }
                          }} 
                        />
                        <div className="absolute bottom-0 text-center w-full">
                          <span className="text-2xl font-black text-slate-800">{stats.satisfaccion}</span><span className="text-slate-400">/5</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Calificación General */}
                    <div>
                      <h5 className="text-center font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Estrellas</h5>
                      <div className="h-48">
                        <Pie data={chartData.calificacion} options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { 
                            legend: { 
                              position: 'bottom',
                              labels: { usePointStyle: true, font: { size: 9 }, padding: 10 }
                            } 
                          }
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* TABLA DE DESGLOSE POR CLASE CON 3 COLUMNAS SEPARADAS */}
                  <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                    <h6 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Rendimiento Detallado por Sesión
                    </h6>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase text-[9px] tracking-widest border-b border-slate-200">
                            <th className="pb-3 px-2">Sala / Turno</th>
                            <th className="pb-3 px-2">Día y Hora</th>
                            <th className="pb-3 px-2 text-center">Votos</th>
                            <th className="pb-3 px-2 text-center text-blue-500">Puntualidad</th>
                            <th className="pb-3 px-2 text-center text-green-500">Satisfacción</th>
                            <th className="pb-3 px-2 text-center text-orange-500">Instructor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {classBreakdown.map((h, idx) => (
                            <tr key={idx} className="hover:bg-white/50 transition-colors">
                              <td className="py-4 px-2">
                                <div className="font-bold text-slate-700">{h.sala}</div>
                                <div className="text-[10px] text-slate-400 uppercase">{Number(h.hora_inicio.substring(0,2)) < 13 ? 'Mañana' : 'Tarde'}</div>
                              </td>
                              <td className="py-4 px-2 text-slate-500 font-medium">{diaNombre(h.dia_semana)} {h.hora_inicio ? String(h.hora_inicio).substring(0, 5) : 'N/A'}</td>
                              <td className="py-4 px-2 text-center">
                                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  {h.total}
                                </span>
                              </td>
                              {/* 3 Columnas Separadas */}
                              <td className="py-4 px-2 text-center">
                                <span className={`font-black ${Number(h.avgPuntualidad) >= 4 ? 'text-blue-500' : 'text-slate-400'}`}>
                                  {h.avgPuntualidad}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-center">
                                <span className={`font-black ${Number(h.avgSatisfaccion) >= 4 ? 'text-green-500' : 'text-slate-400'}`}>
                                  {h.avgSatisfaccion}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-center">
                                <span className={`font-black ${Number(h.avgEstrellas) >= 4 ? 'text-orange-500' : 'text-slate-400'}`}>
                                  {h.avgEstrellas}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}



