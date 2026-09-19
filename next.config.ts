import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

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
        // basePath makes Next rewrite Link hrefs, Image srcs and /_next/ assets.
        basePath,
        // Emits es/index.html rather than es.html, so /TrucksLeon/es/ resolves.
        trailingSlash: true,
      }
    : {
        async headers() {
          return [{ source: '/(.*)', headers: securityHeaders }]
        },
      }),
}

export default withNextIntl(nextConfig)
