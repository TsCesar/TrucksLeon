import type { MetadataRoute } from 'next'
import { siteUrl } from '@/config/site'
import { allowIndexing } from '@/lib/indexing'

/**
 * robots.txt, which differs by environment.
 *
 * A deployment that may not be indexed still ALLOWS crawling, while every page
 * carries `noindex`. That combination is the one that actually works:
 * `Disallow: /` stops a crawler fetching the HTML, so it never reads the
 * `noindex` inside it and a URL already known to the index can linger. Letting
 * the crawler in means it reads the directive and drops the page. The exclusion
 * is therefore carried entirely by the meta robots tag in `src/lib/seo.ts`,
 * plus the `X-Robots-Tag` header from `next.config.ts` — not by this file.
 *
 * Such a deployment publishes no sitemap: there is nothing here we want
 * discovered.
 *
 * The indexable deployment allows everything except the API and points at the
 * sitemap.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: [{ userAgent: '*', allow: '/' }],
    }
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
