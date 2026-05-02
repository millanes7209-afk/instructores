'use client';

import { useState } from 'react';
import Link from 'next/link';
import { instructores } from '@/lib/data';

export default function CalificarIndex() {
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📝 Calificar Instructor
        </h1>
        <p className="text-lg text-gray-600">
          Selecciona el instructor que deseas calificar
        </p>
      </header>

      <main>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Object.values(instructores).map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">{instructor.iniciales}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{instructor.nombre}</h3>
                <p className="text-gray-600">{instructor.especialidad}</p>
              </div>
              
              <Link
                href={`/calificar/${instructor.id}/step/1`}
                className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Comenzar Encuesta
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
