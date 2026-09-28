import { redirect } from 'next/navigation'
import { defaultLocale } from '@/config/locales'
import { RootRedirect } from './RootRedirect'

// Resolved at build time: the static export cannot emit a server redirect.
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

/**
 * `/` in the static export only.
 *
 * In the server build the middleware answers `/` before this page is ever
 * reached — that is where the language is resolved from cookie, then country,
 * then English. The `redirect()` below is an unreachable safety net for a
 * deployment running without middleware, and deliberately uses the routing
 * default rather than the geo fallback: with no middleware there is no cookie
 * and no country to consult.
 *
 * GitHub Pages has no middleware at all, so it ships `<RootRedirect />`, a
 * client-side bounce to the default locale. Geo detection is not available on
 * a static host and is not attempted there.
 */
export default function RootPage() {
  if (isGitHubPages) return <RootRedirect />
  redirect(`/${defaultLocale}`)
}
