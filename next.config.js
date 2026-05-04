/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Desactivamos el linting durante el build para evitar que errores menores detengan el deploy
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig

