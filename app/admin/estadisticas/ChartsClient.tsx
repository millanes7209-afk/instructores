'use client';

import { useState } from 'react';
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
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<string>('');
  const [selectedSala, setSelectedSala] = useState<string>('');

  const salas = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Sala 5'];

  // Filtrar evaluaciones según los criterios seleccionados y el rango de tiempo
  const filteredEvaluaciones = evaluaciones.filter(e => {
    if (!e) return false;
    
    const matchDisciplina = selectedDisciplinaId 
      ? e.disciplina_nombre?.toLowerCase() === disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase() 
      : true;
      
    const matchSala = selectedSala ? e.sala === selectedSala : true;
    
    // Filtro de tiempo (con seguridad para fechas nulas)
    if (selectedTimeRange === 'all') return matchDisciplina && matchSala;
    
    const voteDate = e.created_at ? new Date(e.created_at) : null;
    if (!voteDate || isNaN(voteDate.getTime())) return false;

    const now = new Date();
    const diffDays = (now.getTime() - voteDate.getTime()) / (1000 * 3600 * 24);
    
    const matchTime = selectedTimeRange === 'week' ? diffDays <= 7 : diffDays <= 30;
    
    return matchDisciplina && matchSala && matchTime;
  });

  // Instructores que tienen evaluaciones en los filtros actuales
  const instructoresActivos = instructores.filter(i => 
    filteredEvaluaciones.some(e => Number(e.instructor_id) === Number(i.id))
  );

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
  };

  // Obtener rendimiento por cada clase específica (horario)
  const getClassBreakdown = (instructorId: number) => {
    const instructorHorarios = (horarios || []).filter(h => Number(h.instructor_id) === Number(instructorId));
    
    return instructorHorarios.map(h => {
      const classEvs = filteredEvaluaciones.filter(e => Number(e.horario_id) === Number(h.id));
      const total = classEvs.length;
      const avg = total > 0 
        ? (classEvs.reduce((sum, e) => sum + (Number(e.puntualidad || 0) + Number(e.satisfaccion || 0) + Number(e.calificacion_instructor || 0))/3, 0) / total).toFixed(1)
        : 'N/A';
      
      return { ...h, total, avg };
    }).filter(h => h.total > 0 || !selectedSala);
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

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Dashboard de Rendimiento
        </h1>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          Estadísticas detalladas por clase, semana y mes.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          {/* Filtro de Tiempo */}
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-left ml-1">Periodo</label>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setSelectedTimeRange('week')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedTimeRange === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >Semana</button>
              <button 
                onClick={() => setSelectedTimeRange('month')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedTimeRange === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >Mes</button>
              <button 
                onClick={() => setSelectedTimeRange('all')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedTimeRange === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >Todo</button>
            </div>
          </div>

          {/* Filtro por Sala */}
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-left ml-1">Sala</label>
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-medium text-sm"
              onChange={(e) => setSelectedSala(e.target.value)}
              value={selectedSala}
            >
              <option value="">Todas las Salas</option>
              {salas.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Disciplina */}
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-left ml-1">Disciplina</label>
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-medium text-sm"
              onChange={(e) => setSelectedDisciplinaId(e.target.value)}
              value={selectedDisciplinaId}
            >
              <option value="">Todas las Disciplinas</option>
              {disciplinas.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {instructoresActivos.map((instructor) => {
          const stats = getInstructorStats(instructor.id);
          const chartData = createChartData(instructor.id);
          const classBreakdown = getClassBreakdown(instructor.id);

          return (
            <div key={instructor.id} className="premium-card p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-2xl font-black text-white">{instructor.iniciales}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{instructor.nombre}</h3>
                    <p className="text-slate-500 font-medium">
                      {stats.total} evaluaciones en este periodo
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Promedio General</p>
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

              {/* TABLA DE DESGLOSE POR CLASE */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h6 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Desglose por Clase Específica
                </h6>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                        <th className="pb-3 px-2">Sala</th>
                        <th className="pb-3 px-2">Disciplina</th>
                        <th className="pb-3 px-2">Horario</th>
                        <th className="pb-3 px-2 text-center">Votos</th>
                        <th className="pb-3 px-2 text-right">Rendimiento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classBreakdown.map((h, idx) => (
                        <tr key={idx} className="hover:bg-white/50 transition-colors">
                          <td className="py-3 px-2 font-bold text-slate-700">{h.sala}</td>
                          <td className="py-3 px-2 text-slate-600">{h.disciplina_nombre}</td>
                          <td className="py-3 px-2 text-slate-500">{diaNombre(h.dia_semana)} {h.hora_inicio ? String(h.hora_inicio).substring(0, 5) : 'N/A'}</td>
                          <td className="py-3 px-2 text-center">
                            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              {h.total}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className={`font-black ${Number(h.avg) >= 4 ? 'text-green-500' : Number(h.avg) >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {h.avg}{h.avg !== 'N/A' && '/5.0'}
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
        })}

        {instructoresActivos.length === 0 && (
          <div className="text-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No hay datos en este periodo</h3>
            <p className="text-slate-400">Intenta cambiando el filtro de tiempo o seleccionando otra sala.</p>
          </div>
        )}
      </div>
    </div>
  );
}
