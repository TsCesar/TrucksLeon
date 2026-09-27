import { getTranslations } from 'next-intl/server'
import { siteConfig, siteUrl } from '@/config/site'
import { pages, type PageKey } from '@/config/routes'
import { pageUrl } from '@/lib/seo'
import type { Locale } from '@/config/locales'

/**
 * Structured data.
 *
 * Scope is deliberately narrow — only claims that can be verified from the
 * company's own published details:
 *
 *   Organization    the company itself: legal name, postal address, phone,
 *                   email, logo, the one documented social profile, and the
 *                   area it states it serves.
 *   WebSite         home page only. Name, URL and language. No SearchAction:
 *                   the site has no search, and declaring one would be false.
 *   BreadcrumbList  interior pages only, as Home → Page. That is the real
 *                   structure: navigation is flat, every page sits one level
 *                   under the locale root. No invented categories.
 *
 * Deliberately NOT emitted:
 *   LocalBusiness / AutomotiveBusiness — both describe premises a customer
 *     visits, and would drag `openingHoursSpecification` with them. The "24/7"
 *     on the site is availability of the team by phone and WhatsApp, not the
 *     office being physically open around the clock. Declaring Mo-Su 00:00-23:59
 *     for the address in León would be a straightforwardly false statement.
 *   geo coordinates, VAT/NIF, foundingDate, numberOfEmployees, aggregateRating,
 *     review, priceRange — none of these are documented anywhere, and a schema
 *     is not a place to guess.
 *
 * The inline <script type="application/ld+json"> is covered by the existing
 * `script-src 'unsafe-inline'` already required by Next, so the CSP needs no
 * change and is not weakened.
 */

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Serialised from a plain object built here, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const ORGANIZATION_ID = `${siteUrl}/#organization`

function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url: siteUrl,
    logo: `${siteUrl}/images/brand/logo-trucksleon.png`,
    image: `${siteUrl}${siteConfig.ogImage.path}`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: siteConfig.contact.city,
      postalCode: siteConfig.contact.postalCode,
      addressRegion: siteConfig.contact.region,
      addressCountry: siteConfig.contact.countryCode,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        areaServed: 'EU',
        availableLanguage: ['Spanish', 'English', 'German', 'French', 'Dutch'],
      },
    ],
    areaServed: { '@type': 'Place', name: 'Europe' },
    sameAs: [siteConfig.social.facebook],
  }
}

type Props = {
  locale: string
  page: PageKey
}

export async function JsonLd({ locale, page }: Props) {
  const loc = locale as Locale
  const t = await getTranslations({ locale, namespace: 'seo' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const blocks: Record<string, unknown>[] = [organization()]

  if (page === 'home') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteConfig.brandName,
      inLanguage: loc,
      publisher: { '@id': ORGANIZATION_ID },
    })
  } else {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: tNav('home'),
          item: pageUrl(loc, pages.home),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t(`${page}.title`),
          item: pageUrl(loc, pages[page]),
        },
      ],
    })
  }

  return (
    <>
      {blocks.map((data, i) => (
        <Script key={i} data={data} />
      ))}
    </>
  )
}
