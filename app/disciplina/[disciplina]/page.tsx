import { notFound } from 'next/navigation';
import Link from 'next/link';
import { disciplinas, instructores } from '@/lib/data';

interface PageProps {
  params: {
    disciplina: string;
  };
}

export default function DisciplinaShow({ params }: PageProps) {
  const disciplina = disciplinas[params.disciplina];
  
  if (!disciplina) {
    notFound();
  }

  const instructoresDisciplina = Object.values(instructores)
    .filter(instructor => instructor.especialidad === disciplina.nombre)
    .slice(0, 2); // Limitar a 2 instructores

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Volver a disciplinas
        </Link>
        <div className="text-center">
          <span className="text-6xl block mb-4">{disciplina.icono}</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{disciplina.nombre}</h1>
          <p className="text-lg text-gray-600">{disciplina.descripcion}</p>
        </div>
      </header>

      <main>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {instructoresDisciplina.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">{instructor.iniciales}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{instructor.nombre}</h3>
                <p className="text-gray-600">{instructor.especialidad}</p>
              </div>
              <div className="space-y-2">
                <Link
                  href={`/calificar/${instructor.id}`}
                  className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Calificar Instructor
                </Link>
                <Link
                  href={`/estadisticas/${params.disciplina}`}
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ver Estadísticas
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
