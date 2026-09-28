import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { LOCALE_COOKIE, geoCountryHeaderName, resolveRootLocale } from '@/lib/geo'

/**
 * Locale routing for the SERVER build only.
 *
 * Location matters: this project keeps its source under `src/`, so Next.js
 * resolves middleware from `src/middleware.ts`. The same file once sat at the
 * repository root, where it was silently never loaded — `/contacto` answered
 * 404 instead of redirecting, and the middleware manifest was empty.
 *
 * There are three separate redirect systems in this project and they are kept
 * apart on purpose:
 *
 *   A. Legacy SEO redirects — `next.config.ts` `redirects()`, permanent (308),
 *      identical for every visitor, one hop.
 *   B. Locale prefixing for paths without one — next-intl, below, deterministic
 *      (`/contacto` -> `/es/contacto`) and never geo-dependent.
 *   C. The root language choice — this file, personalised and temporary (307).
 *
 * Only `/` is personalised. A URL that already names its language is served as
 * it was asked for, whatever the cookie or the country says: an explicit locale
 * is the visitor's stated intent and a shared link must open the same page for
 * everyone.
 *
 * The static export has no middleware at all: `scripts/build-pages.mjs` moves
 * this file aside for the Pages build, where `src/app/(root)/page.tsx` handles
 * `/` on the client instead.
 */
const handleLocalePrefix = createMiddleware({
  ...routing,
  // next-intl would otherwise negotiate Accept-Language. Language selection is
  // handled once, here, for `/` only — and by cookie then country, not by
  // browser headers.
  localeDetection: false,
  // hreflang is declared once in the page metadata, built from
  // NEXT_PUBLIC_SITE_URL. Letting the middleware derive a second set from the
  // request host would publish two different answers to the same question.
  alternateLinks: false,
})

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') {
    return handleLocalePrefix(request)
  }

  // Read the one header the operator declared trustworthy, and nothing else.
  const headerName = geoCountryHeaderName()
  const country = headerName ? request.headers.get(headerName) : null

  const { locale, source } = resolveRootLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    country,
  })

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}`

  // 307, not 308: the destination depends on this visitor's cookie and country,
  // so it must never be remembered by a browser or treated as a permanent move
  // by a crawler. Permanent redirects are reserved for the legacy map, which is
  // the same for everyone.
  const response = NextResponse.redirect(url, 307)

  // This response is personalised. Without these, a shared cache in front of
  // the app could serve one visitor's language to everyone who follows.
  response.headers.set('Cache-Control', 'private, no-store, must-revalidate')
  response.headers.set('Vary', 'Cookie')
  // Which rule fired, for debugging a live deployment. Carries no country and
  // no address — only the name of the branch taken.
  response.headers.set('X-Locale-Source', source)

  return response
}

export const config = {
  // Everything except API routes, Next internals and any path with a file
  // extension (so /robots.txt, /sitemap.xml, /icon.png are served directly).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
