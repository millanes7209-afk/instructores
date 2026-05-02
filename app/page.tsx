import Link from 'next/link';
import { disciplinas } from '@/lib/data';

export default function DisciplinasIndex() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📋 Selecciona una Disciplina
        </h1>
        <p className="text-lg text-gray-600">
          Elige la disciplina para ver los instructores disponibles
        </p>
      </header>

      <main>
        <div className="disciplines-grid">
          {Object.entries(disciplinas).map(([key, disciplina]) => (
            <Link
              key={key}
              href={`/disciplina/${key}`}
              className="discipline-card"
            >
              <span className="discipline-icon">{disciplina.icono}</span>
              <h2 className="discipline-title">{disciplina.nombre}</h2>
              <p className="discipline-description">{disciplina.descripcion}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
