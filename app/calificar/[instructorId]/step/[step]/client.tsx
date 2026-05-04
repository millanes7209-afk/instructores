'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  key: string;
  title: string;
  type: 'emoji' | 'stars';
  icon: string;
  options: { [key: string]: string };
}

const questions: Question[] = [
  {
    key: 'puntualidad',
    title: '¿Qué tan puntual fue el instructor?',
    type: 'emoji',
    icon: '⏰',
    options: { 1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' }
  },
  {
    key: 'satisfaccion',
    title: '¿Qué tan satisfecho estás con la clase?',
    type: 'emoji',
    icon: '😄',
    options: { 1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' }
  },
  {
    key: 'calificacion_instructor',
    title: '¿Cómo calificarías al instructor en general?',
    type: 'stars',
    icon: '⭐',
    options: { 1: '★', 2: '★', 3: '★', 4: '★', 5: '★' }
  }
];

export default function SurveyStepClient({ instructor, step }: { instructor: any, step: string }) {
  const router = useRouter();
  const stepNum = parseInt(step);
  const instructorId = instructor.id;
  
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  if (stepNum < 1 || stepNum > 3) {
    return <div>Paso inválido</div>;
  }

  const currentQuestion = questions[stepNum - 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

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
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Cancelar
          </Link>
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  s === stepNum ? 'bg-blue-600 scale-125' : s < stepNum ? 'bg-blue-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <span className="text-3xl font-black text-white">{instructor.iniciales}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{instructor.nombre}</h2>
        </div>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="premium-card p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 opacity-90">
              {currentQuestion.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {currentQuestion.title}
            </h3>
            <p className="text-slate-500">Paso {stepNum} de 3</p>
          </div>

          <div className="mb-8">
            {currentQuestion.type === 'emoji' ? (
              <div className="emoji-rating">
                {Object.entries(currentQuestion.options).map(([value, emoji]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={rating === parseInt(value)}
                      onChange={() => setRating(parseInt(value))}
                    />
                    <span>{emoji}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="star-rating">
                {Object.entries(currentQuestion.options).reverse().map(([value, star]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={rating === parseInt(value)}
                      onChange={() => setRating(parseInt(value))}
                    />
                    <span className="star-char">{star}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <label className="block text-slate-700 font-medium mb-3">
              Comentario adicional (opcional)
            </label>
            <textarea
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
               rows={3}
               placeholder="¿Hay algo más que quieras contarnos?"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            {stepNum > 1 ? (
              <Link
                href={`/calificar/${instructorId}/step/${stepNum - 1}`}
                className="btn-secondary"
              >
                Volver
              </Link>
            ) : (
              <div></div>
            )}
            <button
              type="submit"
              className="btn-primary px-8"
            >
              {stepNum === 3 ? 'Enviar Evaluación ✓' : 'Siguiente Paso →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

