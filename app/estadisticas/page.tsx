import Link from 'next/link';
import { sql } from '@vercel/postgres';
import { ensureSurveyTable } from '@/lib/db';
import { disciplinas, instructores, type Instructor } from '@/lib/data';

export const dynamic = 'force-dynamic';

type StatRow = {
  instructor_id: number;
  avg_general: string;
  total_answers: string;
};

export default async function EstadisticasIndex() {
  await ensureSurveyTable();
  const { rows } = await sql<StatRow>`
    SELECT
      instructor_id,
      ROUND(AVG(rating)::numeric, 1)::text AS avg_general,
      COUNT(*)::text AS total_answers
    FROM survey_responses
    GROUP BY instructor_id
  `;

  const byInstructor = new Map(
    rows.map((row) => [
      Number(row.instructor_id),
      {
        promedio_general: Number(row.avg_general),
        total_respuestas: Number(row.total_answers),
      },
    ])
  );

  const disciplinasConStats = Object.entries(disciplinas).map(([key, disciplina]) => {
    const instructoresDisciplina = Object.values(instructores).filter(
      (instructor) => instructor.especialidad === disciplina.nombre
    );

    let totalRespuestas = 0;
    let promedioGeneral = 0;
    const instructoresConStats: Array<Instructor & { promedio_general: number }> = [];

    instructoresDisciplina.forEach((instructor) => {
      const stats = byInstructor.get(instructor.id);
      if (stats) {
        instructoresConStats.push({ ...instructor, promedio_general: stats.promedio_general });
        totalRespuestas += stats.total_respuestas;
      }
    });

    if (instructoresConStats.length > 0) {
      promedioGeneral =
        instructoresConStats.reduce((sum, instructor) => sum + instructor.promedio_general, 0) /
        instructoresConStats.length;
    }

    return {
      key,
      disciplina,
      instructoresConStats,
      totalRespuestas,
      promedioGeneral: Math.round(promedioGeneral * 10) / 10,
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📊 Estadísticas por Disciplina
        </h1>
        <p className="text-lg text-gray-600">
          Resumen de calificaciones por disciplina e instructor
        </p>
      </header>

      <main>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplinasConStats.map(({ key, disciplina, instructoresConStats, totalRespuestas, promedioGeneral }) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-center mb-4">
                <span className="text-4xl block mb-2">{disciplina.icono}</span>
                <h3 className="text-xl font-semibold text-gray-900">{disciplina.nombre}</h3>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total respuestas:</span>
                  <span className="font-semibold">{totalRespuestas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Promedio general:</span>
                  <span className="font-semibold">{promedioGeneral}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructores:</span>
                  <span className="font-semibold">{instructoresConStats.length}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {instructoresConStats.slice(0, 2).map((instructor) => (
                  <div key={instructor.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{instructor.iniciales}:</span>
                      <span className="font-medium">{instructor.promedio_general}/5.0</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                href={`/estadisticas/${key}`}
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Ver Detalles
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
