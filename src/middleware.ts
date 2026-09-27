import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

/**
 * Locale routing for the SERVER build only.
 *
 * Location matters: this project keeps its source under `src/`, so Next.js
 * resolves middleware from `src/middleware.ts`. The same file previously sat at
 * the repository root, where it was silently never loaded — `/contacto`
 * answered 404 instead of redirecting to `/es/contacto`, and the middleware
 * manifest was empty.
 *
 * `localeDetection: false` is deliberate. next-intl would otherwise pick the
 * locale from the Accept-Language header, which is automatic language
 * selection — that belongs to the Geo-IP work in Fase 5, together with the
 * rule that a manual choice outranks detection. Until then an unprefixed path
 * resolves deterministically to `defaultLocale` (es), and nothing about a
 * visitor changes which page they get.
 *
 * `alternateLinks: false` stops the middleware emitting its own `Link:
 * rel="alternate"` headers. hreflang is declared once, in the page metadata,
 * built from NEXT_PUBLIC_SITE_URL. Letting the middleware derive a second set
 * from the request host would publish two different answers for the same
 * question.
 *
 * The static export has no middleware at all: `scripts/build-pages.mjs` moves
 * this file aside for the Pages build, where `src/app/(root)/page.tsx` handles
 * `/` on the client instead.
 */
export default createMiddleware({
  ...routing,
  localeDetection: false,
  alternateLinks: false,
})

export const config = {
  // Everything except API routes, Next internals and any path with a file
  // extension (so /robots.txt, /sitemap.xml, /icon.png are served directly).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
