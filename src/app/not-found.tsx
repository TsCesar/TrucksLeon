import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-red-accent text-sm tracking-widest uppercase mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-off-white mb-4">Página no encontrada</h1>
        <p className="text-steel mb-8">La página que buscas no existe o ha sido movida.</p>
        <Link
          href="/es"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-red-accent text-white font-semibold hover:bg-red-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
