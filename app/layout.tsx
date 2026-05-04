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
        <div className="min-h-screen">
          <header className="glass-header">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600">
                RateGym<span className="text-slate-400">.</span>
              </Link>

              <div className="flex items-center gap-4">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    <Link href="/estadisticas" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                      Panel
                    </Link>
                    <form action="/logout" method="post">
                      <button
                        type="submit"
                        className="btn-secondary text-sm"
                      >
                        Salir
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link
                    href="/login?next=/estadisticas"
                    className="btn-primary text-sm"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>

  )
}
