'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler
);

// Plugin para la aguja del velocímetro
const gaugeNeedle = {
  id: 'gaugeNeedle',
  afterDatasetDraw(chart: any, args: any, options: any) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { width, height } = chartArea;
    ctx.save();

    const average = options.average || 3;
    const percentage = (average - 1) / 4;
    const angle = Math.PI + (percentage * Math.PI);

    const cx = chart.getDatasetMeta(0).data[0].x;
    const cy = chart.getDatasetMeta(0).data[0].y;

    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(height / 1.5, 0);
    ctx.lineTo(0, 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 10);
    ctx.fill();
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

  // 1. Filtrar instructores por disciplina
  const instructoresDeDisciplina = useMemo(() => {
    if (!selectedDisciplinaId) return [];
    const disciplinaNombre = disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase();
    return instructores.filter(i =>
      horarios.some(h => h.instructor_id === i.id && h.disciplina_nombre.toLowerCase() === disciplinaNombre)
    );
  }, [selectedDisciplinaId, instructores, horarios, disciplinas]);

  // 2. Filtrar evaluaciones
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
      const diffDays = (new Date().getTime() - voteDate.getTime()) / (1000 * 3600 * 24);
      const matchTime = selectedTimeRange === 'week' ? diffDays <= 7 : diffDays <= 30;

      return matchDisciplina && matchSala && matchTime && matchInstructor;
    });
  }, [evaluaciones, selectedDisciplinaId, selectedSala, selectedInstructorId, selectedTimeRange, disciplinas]);

  const getInstructorStats = (instructorId: number) => {
    const evs = filteredEvaluaciones.filter(e => Number(e.instructor_id) === Number(instructorId));
    if (evs.length === 0) return { total: 0, puntualidad: 0, satisfaccion: 0, calificacion: 0 };
    const total = evs.length;
    return {
      total,
      puntualidad: Math.round((evs.reduce((sum, e) => sum + Number(e.puntualidad || 0), 0) / total) * 10) / 10,
      satisfaccion: Math.round((evs.reduce((sum, e) => sum + Number(e.satisfaccion || 0), 0) / total) * 10) / 10,
      calificacion: Math.round((evs.reduce((sum, e) => sum + Number(e.calificacion_instructor || 0), 0) / total) * 10) / 10
    };
  };

  const getClassBreakdown = (instructorId: number) => {
    const disciplinaNombre = disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase();
    const instHorarios = (horarios || []).filter(h =>
      Number(h.instructor_id) === Number(instructorId) &&
      (!disciplinaNombre || h.disciplina_nombre.toLowerCase() === disciplinaNombre)
    );

    return instHorarios.map(h => {
      const classEvs = filteredEvaluaciones.filter(e => Number(e.horario_id) === Number(h.id));
      const total = classEvs.length;
      return {
        ...h,
        total,
        punt: total > 0 ? (classEvs.reduce((sum, e) => sum + Number(e.puntualidad || 0), 0) / total).toFixed(1) : 'N/A',
        sat: total > 0 ? (classEvs.reduce((sum, e) => sum + Number(e.satisfaccion || 0), 0) / total).toFixed(1) : 'N/A',
        est: total > 0 ? (classEvs.reduce((sum, e) => sum + Number(e.calificacion_instructor || 0), 0) / total).toFixed(1) : 'N/A',
      };
    });
  };

  const createChartData = (instructorId: number) => {
    const instructorEvs = filteredEvaluaciones.filter(e => Number(e.instructor_id) === Number(instructorId));
    return {
      satisfaccion: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
          data: [1, 1, 1, 1, 1],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
          circumference: 180,
          rotation: -90,
          cutout: '75%'
        }]
      },
      calificacion: {
        labels: ['1★', '2★', '3★', '4★', '5★'],
        datasets: [{
          data: [
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 1).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 2).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 3).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 4).length,
            instructorEvs.filter(e => Number(e.calificacion_instructor) === 5).length,
          ],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
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
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      }
    };
  };

  const diaNombre = (num: any) => {
    const n = Number(num);
    return ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][n - 1] || 'N/A';
  };

  const selectedInstructor = instructores.find(i => i.id === selectedInstructorId);
  const selectedDisciplina = disciplinas.find(d => d.id.toString() === selectedDisciplinaId);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Estadísticas</h1>
        <p className="text-slate-500">Panel de control y rendimiento de instructores</p>
      </div>

      {/* BARRA DE NAVEGACIÓN Y FILTROS */}
      {(selectedDisciplinaId || selectedInstructorId) && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 animate-in fade-in zoom-in-95">
          <button
            onClick={() => {
              if (selectedInstructorId) setSelectedInstructorId(null);
              else setSelectedDisciplinaId('');
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all active:scale-95"
          >
            ← Volver
          </button>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {(['week', 'month', 'all'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedTimeRange(r)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    selectedTimeRange === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  {r === 'week' ? 'Semana' : r === 'month' ? 'Mes' : 'Todo'}
                </button>
              ))}
            </div>

            <select
              className="bg-slate-100 border-none rounded-2xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
              value={selectedSala}
              onChange={(e) => setSelectedSala(e.target.value)}
            >
              <option value="">Todas las Salas</option>
              {salas.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* PANTALLA 1: DISCIPLINAS */}
      {!selectedDisciplinaId && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-8">
          {disciplinas.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDisciplinaId(d.id.toString())}
              className="group p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400 transition-all text-center active:scale-95"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{d.icono}</div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">{d.nombre}</div>
            </button>
          ))}
        </div>
      )}

      {/* PANTALLA 2: INSTRUCTORES */}
      {selectedDisciplinaId && !selectedInstructorId && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{selectedDisciplina?.icono}</div>
            <h2 className="text-3xl font-black text-slate-900">Instructores de {selectedDisciplina?.nombre}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {instructoresDeDisciplina.map((i) => (
              <button
                key={i.id}
                onClick={() => setSelectedInstructorId(i.id)}
                className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group text-center"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all font-black text-2xl text-blue-600">
                  {i.iniciales}
                </div>
                <div className="font-bold text-slate-800">{i.nombre}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PANTALLA 3: REPORTE */}
      {selectedInstructor && (
        <div className="animate-in fade-in slide-in-from-bottom-8">
          {(() => {
            const stats = getInstructorStats(selectedInstructor.id);
            const chartData = createChartData(selectedInstructor.id);
            const breakdown = getClassBreakdown(selectedInstructor.id);

            return (
              <div className="space-y-10">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
                      {selectedInstructor.iniciales}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">{selectedInstructor.nombre}</h2>
                      <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        <span>{selectedDisciplina?.nombre}</span>
                        <span>•</span>
                        <span>{stats.total} evaluaciones</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                      <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Puntualidad</div>
                      <div className="text-2xl font-black text-blue-600">{stats.puntualidad}</div>
                    </div>
                    <div className="px-6 py-3 bg-green-50 rounded-2xl border border-green-100 text-center">
                      <div className="text-[9px] font-black text-green-400 uppercase mb-1">Satisfacción</div>
                      <div className="text-2xl font-black text-green-600">{stats.satisfaccion}</div>
                    </div>
                    <div className="px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                      <div className="text-[9px] font-black text-orange-400 uppercase mb-1">Estrellas</div>
                      <div className="text-2xl font-black text-orange-600">{stats.calificacion}</div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-6">Gráfico Puntualidad</h4>
                    <div className="h-48"><Line data={chartData.puntualidad} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative">
                    <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-6">Nivel Satisfacción</h4>
                    <div className="h-40"><Doughnut data={chartData.satisfaccion} plugins={[gaugeNeedle]} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false }, gaugeNeedle: { average: stats.satisfaccion } } }} /></div>
                    <div className="absolute bottom-10 left-0 right-0 font-black text-2xl">{stats.satisfaccion}<span className="text-slate-300 text-sm">/5</span></div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                    <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-6">Distribución Estrellas</h4>
                    <div className="h-48"><Pie data={chartData.calificacion} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 9 } } } } }} /></div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                    Rendimiento Detallado por Sesión
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="pb-4 px-4">Sala / Turno</th>
                          <th className="pb-4 px-4">Día / Hora</th>
                          <th className="pb-4 px-4 text-center">Votos</th>
                          <th className="pb-4 px-4 text-center text-blue-500">Punt.</th>
                          <th className="pb-4 px-4 text-center text-green-500">Satisf.</th>
                          <th className="pb-4 px-4 text-center text-orange-500">Instr.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {breakdown.map((h, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-4 font-bold text-slate-700">
                              {h.sala}
                              <div className="text-[9px] font-black text-slate-300 uppercase">{Number(h.hora_inicio.substring(0,2)) < 13 ? 'Mañana' : 'Tarde'}</div>
                            </td>
                            <td className="py-5 px-4 text-slate-500 text-sm">{diaNombre(h.dia_semana)} {String(h.hora_inicio || '').substring(0, 5)}</td>
                            <td className="py-5 px-4 text-center"><span className="px-2 py-1 bg-slate-100 rounded-lg font-black text-xs">{h.total}</span></td>
                            <td className="py-5 px-4 text-center font-black text-blue-600">{h.punt}</td>
                            <td className="py-5 px-4 text-center font-black text-green-600">{h.sat}</td>
                            <td className="py-5 px-4 text-center font-black text-orange-600">{h.est}</td>
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
  );
}
