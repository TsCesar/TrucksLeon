import type { MetadataRoute } from 'next'
import { locales } from '@/config/locales'
import { pages, pageKeys } from '@/config/routes'
import { pageUrl, xDefaultLocale } from '@/lib/seo'

/**
 * Sitemap for the eleven public pages in each of the five languages.
 *
 * Built from `src/config/routes.ts`, the same table the metadata uses, so a
 * page cannot appear here without a title and description — or be given
 * metadata and then forgotten in the sitemap.
 *
 * Deliberately omitted:
 *   - `lastModified`: nothing in this content has a real modification date, and
 *     a synthesised one is a signal that is simply untrue.
 *   - `changeFrequency` / `priority`: hints Google has publicly said it ignores.
 *   - /api, the 404 and any Pages-only artefact.
 *
 * `alternates.languages` mirrors the hreflang in each page's head, so the two
 * cannot disagree.
 */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    pageKeys.map((key) => {
      const path = pages[key]
      const languages: Record<string, string> = {}
      for (const alt of locales) {
        languages[alt] = pageUrl(alt, path)
      }
      languages['x-default'] = pageUrl(xDefaultLocale, path)

      return {
        url: pageUrl(locale, path),
        alternates: { languages },
      }
    })
  )
}
