import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { LEGACY_REDIRECTS } from './src/config/legacy-redirects'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/**
 * Two build modes share this file:
 *
 *  normal (`npm run build` / `npm run dev`)
 *    Server-rendered Next: API routes, middleware, image optimisation and the
 *    security headers below all stay active. No basePath.
 *
 *  GitHub Pages (`npm run build:pages` → GITHUB_PAGES=true)
 *    Static export into out/, served from https://tscesar.github.io/TrucksLeon/.
 *    `headers()` is omitted because static export cannot emit response headers —
 *    the header list itself is kept intact for the normal build.
 */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * Mirrors `src/lib/indexing.ts`. Read from the environment directly because a
 * config file cannot rely on the `@/` path alias. Kept in sync by the SEO check
 * in `scripts/check-seo.mjs`, which compares the header with the meta tag.
 */
const allowIndexing = !isGitHubPages && process.env.ALLOW_INDEXING === 'true'

/**
 * Belt and braces for a deployment that must not be indexed.
 *
 * The meta tag in the document head covers HTML. This header covers everything
 * else a crawler can reach — sitemap.xml, images, the OG card — and is read
 * even when the response is never parsed as a document.
 */
const noIndexHeader = {
  key: 'X-Robots-Tag',
  value: 'noindex, nofollow, noarchive',
}

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    // Static export has no image optimisation server.
    unoptimized: isGitHubPages,
  },
  ...(isGitHubPages
    ? {
        output: 'export' as const,
        // Separate build directory. Both modes used to write to .next, so
        // whichever ran last owned it — running `npm start` after
        // `npm run build:pages` served the basePath build with no API routes.
        // The static export still lands in out/, which is independent of this.
        distDir: '.next-pages',
        // basePath makes Next rewrite Link hrefs, Image srcs and /_next/ assets.
        basePath,
        // Emits es/index.html rather than es.html, so /TrucksLeon/es/ resolves.
        trailingSlash: true,
      }
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: allowIndexing ? securityHeaders : [...securityHeaders, noIndexHeader],
            },
          ]
        },
        /**
         * Permanent redirects from the previous website.
         *
         * Declared here rather than in the middleware on purpose. Next
         * evaluates `redirects()` before middleware runs, so an old URL lands
         * on its final destination in a single hop instead of chaining through
         * the locale middleware. They are also static, identical for everyone
         * and cacheable — none of which is true of the root language redirect,
         * which stays in the middleware.
         *
         * Omitted from the static export: GitHub Pages cannot serve redirects,
         * and staging is not what search engines hold links to.
         */
        async redirects() {
          return LEGACY_REDIRECTS.map(({ from, to }) => ({
            source: from,
            destination: to,
            permanent: true,
          }))
        },
      }),
}

export default withNextIntl(nextConfig)
