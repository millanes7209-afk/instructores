import Link from 'next/link';
import { disciplinas } from '@/lib/data';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selecciona una Disciplina
        </h1>
        <p className="text-lg text-gray-600">
          Elige la disciplina para ver los instructores disponibles
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(disciplinas).map(([key, disciplina]) => (
            <Link
              key={key}
              href={`/disciplina/${key}`}
              className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl block mb-4">{disciplina.icono}</span>
              <h2 className="text-xl font-bold text-gray-800">{disciplina.nombre}</h2>
              <p className="text-gray-600">{disciplina.descripcion}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

