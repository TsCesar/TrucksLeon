/**
 * Base path helpers.
 *
 * On GitHub Pages the site is served from https://tscesar.github.io/TrucksLeon/
 * instead of the domain root, so every absolute URL needs a `/TrucksLeon` prefix.
 *
 * Next already applies `basePath` automatically to:
 *   - <Link href="/es"> and router.push/replace
 *   - <Image src="/images/…"> (and every /_next/ asset)
 *   - usePathname(), which returns the path WITHOUT the prefix
 *
 * So `assetPath` is only for the few places Next cannot rewrite for us —
 * chiefly the metadata `icons` entries, which are emitted verbatim.
 * Never wrap a <Link> or <Image> value with it: that would double the prefix.
 */

/** '' in normal builds, '/TrucksLeon' in the GitHub Pages build. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** True when this bundle was built by `npm run build:pages`. */
export const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true'

/** Prefix a public/ asset path that Next does not rewrite by itself. */
export function assetPath(path: string): string {
  return `${basePath}${path}`
}
