import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig, siteUrl, isStaging, usesTrailingSlash, ogLocales } from '@/config/site'
import { locales, type Locale } from '@/config/locales'
import { assetPath } from '@/lib/paths'
import { pages, type PageKey } from '@/config/routes'

/**
 * x-default points at English.
 *
 * `defaultLocale` is `es` because that is what an unprefixed URL resolves to
 * today — a routing decision. x-default answers a different question: which
 * page should a search engine show someone whose language we do not publish.
 * For a company trading across Europe that is English, and it matches the
 * Fase 5 rule that a country without a supported language falls back to /en.
 */
export const xDefaultLocale: Locale = 'en'

/** Absolute URL of a page in a given locale, matching what is actually served. */
export function pageUrl(locale: Locale, path: string): string {
  const base = `${siteUrl}/${locale}${path}`
  return usesTrailingSlash ? `${base}/` : base
}

/** The absolute URL of the shared Open Graph image. */
export function ogImageUrl(): string {
  return `${siteUrl}${siteConfig.ogImage.path}`
}

/**
 * hreflang map: all five locales plus x-default.
 *
 * Every localized page exists at the same slug in every language, so the set is
 * complete by construction rather than maintained by hand.
 */
function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {}
  for (const locale of locales) {
    map[locale] = pageUrl(locale, path)
  }
  map['x-default'] = pageUrl(xDefaultLocale, path)
  return map
}

/**
 * Indexing policy.
 *
 * GitHub Pages is a public demo. If it were indexed it would compete with
 * trucksleon.com for the same content in five languages.
 *
 * The exclusion lives HERE, in the head of every page, and not in robots.txt.
 * A `Disallow` only stops the fetch: the crawler never sees the directive it
 * would need to drop the URL, so staging's robots.txt allows crawling
 * precisely so that this tag is read. Removing it would leave the demo
 * indexable.
 */
const robots: Metadata['robots'] = isStaging
  ? {
      index: false,
      follow: false,
      noarchive: true,
      googleBot: { index: false, follow: false, noarchive: true },
    }
  : { index: true, follow: true }

type BuildArgs = {
  locale: string
  page: PageKey
}

/**
 * Metadata for one localized page.
 *
 * Titles come back as a plain string so the template declared on the locale
 * layout (`%s | TrucksLeón International`) applies exactly once — the home page
 * is the single exception and sets an absolute title.
 */
export async function buildMetadata({ locale, page }: BuildArgs): Promise<Metadata> {
  const loc = locale as Locale
  const path = pages[page]
  const t = await getTranslations({ locale, namespace: 'seo' })

  const title = t(`${page}.title`)
  const description = t(`${page}.description`)
  const url = pageUrl(loc, path)
  const image = ogImageUrl()

  return {
    // The home page IS the brand, so it does not get the "… | Brand" suffix.
    title: page === 'home' ? { absolute: `${title} | ${siteConfig.brandName}` } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.brandName,
      title,
      description,
      url,
      locale: ogLocales[loc],
      alternateLocale: locales.filter((l) => l !== loc).map((l) => ogLocales[l]),
      images: [
        {
          url: image,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: siteConfig.brandName,
        },
      ],
    },
    twitter: {
      // No company account is documented, so no `site`/`creator` handle is
      // invented — the large card renders correctly without one.
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots,
  }
}

/** Shared defaults declared once on the locale layout. */
export async function buildRootMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' })

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${t('home.title')} | ${siteConfig.brandName}`,
      template: `%s | ${siteConfig.brandName}`,
    },
    description: t('home.description'),
    applicationName: siteConfig.brandName,
    authors: [{ name: siteConfig.legalName }],
    creator: siteConfig.legalName,
    publisher: siteConfig.legalName,
    formatDetection: { telephone: true, address: false, email: false },
    // Metadata icon hrefs are emitted verbatim — Next does not apply basePath
    // here, so the Pages build needs it added explicitly.
    icons: {
      icon: assetPath('/images/brand/logo-trucksleon.png'),
      shortcut: assetPath('/images/brand/logo-trucksleon.png'),
      apple: assetPath('/images/brand/logo-trucksleon.png'),
    },
    robots,
  }
}
