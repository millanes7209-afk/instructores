import Link from 'next/link';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DisciplinasIndex() {
  const now = new Date();
  const diaSemana = now.getDay() === 0 ? 7 : now.getDay();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  const horaActual = `${h}:${m}:${s}`;

  const result = await query(`
    SELECT DISTINCT d.* 
    FROM disciplinas d
    JOIN horarios h ON d.id = h.disciplina_id
    WHERE h.dia_semana = $1
    AND h.hora_inicio BETWEEN ($2::TIME - INTERVAL '2 hours') AND ($2::TIME + INTERVAL '2 hours')
    ORDER BY d.nombre ASC
  `, [diaSemana, horaActual]);
  
  const disciplinas = result.rows as any[];

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3 block">
            Nivel Fitness Club | Feedback en tiempo real
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Evalúa a tu <span className="text-blue-600">Instructor.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Tu opinión nos ayuda a mantener el nivel de excelencia. 
            Selecciona la disciplina para comenzar la evaluación.
          </p>
        </header>

        <div className="disciplines-grid">
          {disciplinas.map((disciplina) => (
            <Link
              key={disciplina.slug}
              href={`/disciplina/${disciplina.slug}`}
              className="discipline-card group"
            >
              <div className="discipline-icon">
                {disciplina.icono}
              </div>
              <div>
                <h2 className="discipline-title group-hover:text-blue-600 transition-colors">
                  {disciplina.nombre}
                </h2>
                <p className="discipline-description mt-2">
                  {disciplina.descripcion || 'Selecciona para ver instructores'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {disciplinas.length === 0 && (
          <div className="text-center p-12 bg-slate-50 rounded-3xl border border-slate-100 max-w-xl mx-auto">
            <span className="text-4xl mb-4 block">😴</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No hay clases activas en este momento</h3>
            <p className="text-slate-500">
              Vuelve cuando esté por comenzar tu clase o al finalizar la misma para calificar a tu instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}





