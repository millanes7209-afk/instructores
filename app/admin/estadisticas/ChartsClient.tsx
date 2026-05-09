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
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('all');
  const [selectedHorarioId, setSelectedHorarioId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const salas = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Sala 5'];

  const instructoresDeDisciplina = useMemo(() => {
    if (!selectedDisciplinaId) return [];
    const disciplinaNombre = disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase();
    return instructores.filter(i =>
      horarios.some(h => h.instructor_id === i.id && h.disciplina_nombre.toLowerCase() === disciplinaNombre)
    );
  }, [selectedDisciplinaId, instructores, horarios, disciplinas]);

  const filteredEvaluaciones = useMemo(() => {
    return evaluaciones.filter(e => {
      if (!e) return false;
      
      const matchDisciplina = selectedDisciplinaId
        ? e.disciplina_nombre?.toLowerCase() === disciplinas.find(d => d.id.toString() === selectedDisciplinaId)?.nombre.toLowerCase()
        : true;
      const matchInstructor = selectedInstructorId ? Number(e.instructor_id) === selectedInstructorId : true;
      const matchHorario = selectedHorarioId ? Number(e.horario_id) === selectedHorarioId : true;
      const matchSala = selectedSala ? e.sala === selectedSala : true;

      if (!matchDisciplina || !matchInstructor || !matchHorario || !matchSala) return false;

      if (selectedTimeRange === 'all') return true;

      const voteDate = e.created_at ? new Date(e.created_at) : null;
      if (!voteDate || isNaN(voteDate.getTime())) return false;

      if (selectedTimeRange === 'week') {
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return voteDate >= start && voteDate <= end;
        }
        const diffDays = (new Date().getTime() - voteDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }

      const diffDays = (new Date().getTime() - voteDate.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 30;
    });
  }, [evaluaciones, selectedDisciplinaId, selectedSala, selectedInstructorId, selectedTimeRange, selectedHorarioId, disciplinas]);

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
      const classEvs = evaluaciones.filter(e => Number(e.horario_id) === Number(h.id));
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
        <h1 className="text-4xl font-black text-slate-900 mb-2">Análisis de Rendimiento</h1>
        <p className="text-slate-500">Visualiza el impacto de cada clase y turno</p>
      </div>

      {(selectedDisciplinaId || selectedInstructorId) && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
          <button
            onClick={() => {
              if (selectedHorarioId) setSelectedHorarioId(null);
              else if (selectedInstructorId) setSelectedInstructorId(null);
              else setSelectedDisciplinaId('');
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all active:scale-95"
          >
            ← Volver
          </button>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {(['all', 'week', 'month'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedTimeRange(r);
                    if (r !== 'all') setSelectedHorarioId(null);
                  }}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    selectedTimeRange === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  {r === 'all' ? 'Clases' : r === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
            
            {selectedTimeRange === 'week' && (
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl animate-in zoom-in-95 duration-200">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border-none rounded-xl px-3 py-1.5 text-[10px] font-black text-slate-600 outline-none"
                  placeholder="Inicio"
                />
                <span className="text-slate-400 font-bold text-[10px]">al</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border-none rounded-xl px-3 py-1.5 text-[10px] font-black text-slate-600 outline-none"
                  placeholder="Fin"
                />
              </div>
            )}

            {!selectedHorarioId && (
              <select
                className="bg-slate-100 border-none rounded-2xl px-4 py-2 text-xs font-bold text-slate-700 outline-none"
                value={selectedSala}
                onChange={(e) => setSelectedSala(e.target.value)}
              >
                <option value="">Todas las Salas</option>
                {salas.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
        </div>
      )}

      <div className="space-y-10">
        {!selectedDisciplinaId && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-8">
            {disciplinas.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDisciplinaId(d.id.toString())}
                className="group p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400 transition-all text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{d.icono}</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">{d.nombre}</div>
              </button>
            ))}
          </div>
        )}

        {selectedDisciplinaId && !selectedInstructorId && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">{selectedDisciplina?.icono}</div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Instructores de {selectedDisciplina?.nombre}</h2>
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

        {selectedInstructorId && selectedTimeRange === 'all' && !selectedHorarioId && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Sesiones Semanales de {selectedInstructor?.nombre}</h3>
              <p className="text-slate-500">Selecciona una clase específica para ver su rendimiento detallado</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getClassBreakdown(selectedInstructorId!).map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHorarioId(h.id)}
                  className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all flex items-center justify-between group active:scale-95"
                >
                  <div className="text-left">
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{h.sala} • {Number(h.hora_inicio.substring(0,2)) < 13 ? 'Mañana' : 'Tarde'}</div>
                    <div className="text-xl font-black text-slate-800">{diaNombre(h.dia_semana)} {h.hora_inicio.substring(0,5)}</div>
                    <div className="flex gap-2 mt-2">
                       <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase">Punt: {h.punt}</span>
                       <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase">Sat: {h.sat}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-5 py-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all text-center">
                    <div className="text-2xl font-black leading-none">{h.total}</div>
                    <div className="text-[8px] uppercase font-bold mt-1">votos</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedInstructor && (selectedTimeRange !== 'all' || selectedHorarioId) && (
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
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                          {selectedTimeRange === 'week' ? 'Reporte Semanal' : selectedTimeRange === 'month' ? 'Reporte Mensual' : 'Reporte de Sesión'} • {stats.total} votos
                        </p>
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
                        <div className="text-[9px] font-black text-orange-400 uppercase mb-1">Instructor</div>
                        <div className="text-2xl font-black text-orange-600">{stats.calificacion}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                      <h4 className="font-bold text-slate-400 text-[10px] uppercase mb-6">Puntualidad</h4>
                      <div className="h-48"><Line data={chartData.puntualidad} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative">
                      <h4 className="font-bold text-slate-400 text-[10px] uppercase mb-6">Satisfacción</h4>
                      <div className="h-40"><Doughnut data={chartData.satisfaccion} plugins={[gaugeNeedle]} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false }, gaugeNeedle: { average: stats.satisfaccion } } }} /></div>
                      <div className="absolute bottom-10 left-0 right-0 font-black text-2xl">{stats.satisfaccion}<span className="text-slate-300 text-sm">/5</span></div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                      <h4 className="font-bold text-slate-400 text-[10px] uppercase mb-6">Estrellas</h4>
                      <div className="h-48"><Pie data={chartData.calificacion} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 9 } } } } }} /></div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                      <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                      Rendimiento por Sesión
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="pb-4 px-4">Sala / Turno</th>
                            <th className="pb-4 px-4">Día / Hora</th>
                            <th className="pb-4 px-4 text-center">Votos</th>
                            <th className="pb-4 px-4 text-center text-blue-500">Puntualidad</th>
                            <th className="pb-4 px-4 text-center text-green-500">Satisfacción</th>
                            <th className="pb-4 px-4 text-center text-orange-500">Instructor</th>
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
    </div>
  );
}
