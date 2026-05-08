import { notFound } from 'next/navigation';
import Link from 'next/link';
import { query } from '@/lib/db';

interface PageProps {
  params: {
    disciplina: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function DisciplinaShow({ params }: PageProps) {
  const resDisp = await query('SELECT * FROM disciplinas WHERE slug = $1 LIMIT 1', [params.disciplina]);
  const disciplina = resDisp.rows[0] as any;
  
  if (!disciplina) {
    notFound();
  }

  const resInst = await query(`
    SELECT DISTINCT i.* 
    FROM instructores i
    JOIN horarios h ON i.id = h.instructor_id
    WHERE h.disciplina_id = $1
  `, [disciplina.id]);
  const instructoresDisciplina = resInst.rows as any[];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          ← Volver a disciplinas
        </Link>
        <div className="text-center">
          <span className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4 block">
            NIVEL FITNESS CLUB
          </span>
          <span className="text-6xl block mb-4">{disciplina.icono}</span>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{disciplina.nombre}</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">{disciplina.descripcion || 'Selecciona un instructor para evaluar su clase.'}</p>
        </div>
      </header>

      <main>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {instructoresDisciplina.map((instructor) => (
            <Link
              href={`/calificar/${instructor.id}/step/1`}
              key={instructor.id}
              className="premium-card p-6 cursor-pointer block group"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <span className="text-3xl font-black text-white">{instructor.iniciales}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{instructor.nombre}</h3>
                <p className="text-slate-500 text-sm font-medium">{disciplina.nombre}</p>
              </div>
              <div className="text-center text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Evaluar Instructor →
              </div>
            </Link>
          ))}
          {instructoresDisciplina.length === 0 && (
             <div className="col-span-full text-center p-10 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-slate-500">No hay instructores asignados a esta disciplina.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}


