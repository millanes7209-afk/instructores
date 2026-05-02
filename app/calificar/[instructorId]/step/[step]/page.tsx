'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { instructores } from '@/lib/data';

interface PageProps {
  params: {
    instructorId: string;
    step: string;
  };
}

const questions = [
  { key: 'puntualidad', label: '¿Qué tan puntual fue el instructor?' },
  { key: 'satisfaccion', label: '¿Qué tan satisfecho estás con la clase?' },
  { key: 'calificacion_instructor', label: '¿Cómo calificarías al instructor en general?' },
];

export default function SurveyStep({ params }: PageProps) {
  const router = useRouter();
  const instructorId = parseInt(params.instructorId);
  const stepNum = parseInt(params.step);
  const instructor = instructores[instructorId];
  
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  if (!instructor || stepNum < 1 || stepNum > 3) {
    return <div>Instructor no encontrado o paso inválido</div>;
  }

  const currentQuestion = questions[stepNum - 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    // Guardar temporalmente por pasos en sessionStorage.
    // Al finalizar el paso 3 se envian todos los datos a la API.
    const key = `survey:${instructorId}`;
    const surveyData = JSON.parse(sessionStorage.getItem(key) || '{}');
    surveyData[currentQuestion.key] = { rating, comment };
    sessionStorage.setItem(key, JSON.stringify(surveyData));

    if (stepNum < 3) {
      router.push(`/calificar/${instructorId}/step/${stepNum + 1}`);
    } else {
      const payload = {
        instructorId,
        answers: surveyData,
      };

      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert('No se pudo guardar la encuesta. Intenta de nuevo.');
        return;
      }

      sessionStorage.removeItem(key);
      router.push('/calificar/gracias');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="text-center mb-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/calificar" className="text-blue-600 hover:text-blue-800">
            ← Volver
          </Link>
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${
                  s <= stepNum ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-blue-600">{instructor.iniciales}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{instructor.nombre}</h2>
          <p className="text-gray-600">{instructor.especialidad}</p>
        </div>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Paso {stepNum} de 3
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              {currentQuestion.label}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-center space-x-4 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div className="flex justify-center text-sm text-gray-600">
              <span className="mr-4">1 - Muy mal</span>
              <span>5 - Excelente</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Agrega un comentario..."
            />
          </div>

          <div className="flex justify-between">
            {stepNum > 1 && (
              <Link
                href={`/calificar/${instructorId}/step/${stepNum - 1}`}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Anterior
              </Link>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
            >
              {stepNum === 3 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
