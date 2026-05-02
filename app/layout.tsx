import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { isAdminAuthenticated } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RateGym - Sistema de Instructores',
  description: 'Sistema de evaluación de instructores de gimnasio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = isAdminAuthenticated()

  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold text-gray-900">
                RateGym
              </Link>

              <div className="flex items-center gap-3">
                <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">
                  Disciplinas
                </Link>
                <Link href="/calificar" className="text-sm text-gray-700 hover:text-gray-900">
                  Votar
                </Link>
                <Link href="/estadisticas" className="text-sm text-gray-700 hover:text-gray-900">
                  Estadisticas
                </Link>

                {isLoggedIn ? (
                  <form action="/logout" method="post">
                    <button
                      type="submit"
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md"
                    >
                      Cerrar sesion
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login?next=/estadisticas"
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
