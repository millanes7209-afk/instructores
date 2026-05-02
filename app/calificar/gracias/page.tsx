import Link from 'next/link';
import { RedirectToHome } from './redirect-to-home';

export default function GraciasPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <RedirectToHome />
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Gracias por tu evaluación!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tu opinión nos ayuda a mejorar la calidad de nuestras clases
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Te redirigimos a disciplinas en 1 segundo...
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/calificar"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Calificar otro instructor
          </Link>
          
          <br />
          
          <Link
            href="/"
            className="inline-block text-blue-600 hover:text-blue-800"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
