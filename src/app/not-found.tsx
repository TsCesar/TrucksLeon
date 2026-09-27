import Link from 'next/link'
import { defaultLocale } from '@/config/locales'

/**
 * Last-resort 404.
 *
 * It has to live here, at the app root, because this is the only place Next
 * generates the static `404.html` from — and that file is what GitHub Pages
 * serves for any unknown path. Moved into a route group it stopped being the
 * global not-found and the export shipped Next's unbranded default instead.
 *
 * Known trade-off: sitting above both root layouts, Next wraps it in its own
 * document shell, so this one page emits `<html>` without a `lang`. Every real
 * page carries the correct language. In the server build the locale catch-all
 * (`[locale]/[...rest]`) means visitors reach the localized 404 in
 * `[locale]/not-found.tsx` instead, and this file is only hit by paths the
 * middleware skips.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-red-text text-sm tracking-widest uppercase mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-ink mb-4 tracking-tight">Página no encontrada</h1>
        <p className="text-steel mb-8">La página que buscas no existe o ha sido movida.</p>
        <Link
          href={`/${defaultLocale}`}
          className="inline-flex items-center px-6 py-3 min-h-[46px] rounded-lg bg-red-accent text-white font-semibold shadow-red hover:bg-red-dark hover:-translate-y-px transition-all duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
