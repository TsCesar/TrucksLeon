import type { Locale } from '@/config/locales'

/**
 * Single source of truth for everything that identifies the company online.
 * Nothing here may be duplicated in a component — metadata, JSON-LD, the
 * sitemap and robots all read from this file.
 */

/**
 * Where this build will actually be served from.
 *
 * Two environments exist:
 *   staging  — https://tscesar.github.io/TrucksLeon  (set by build:pages)
 *   prod     — https://trucksleon.com                (the default)
 *
 * The staging value ALREADY contains the /TrucksLeon base path, so canonical
 * and hreflang URLs are built by appending to it and must never add the base
 * path a second time.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trucksleon.com').replace(
  /\/+$/,
  ''
)

/** True when this bundle was produced by `npm run build:pages`. */
export const isStaging = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true'

/**
 * The Pages export uses `trailingSlash: true`; the server build does not.
 * Canonical URLs have to match the URL that is actually served, so the two
 * environments genuinely differ here.
 */
export const usesTrailingSlash = isStaging

export const siteConfig = {
  /** Short form used in running copy and as the OG site name. */
  name: 'TrucksLeón',
  /** Full brand, used as the title suffix. */
  brandName: 'TrucksLeón International',
  /** Registered company name — used in legal copy and JSON-LD. */
  legalName: 'TRUCKS LEON INTERNATIONAL, S.L.',
  tagline: 'Gestión integral de vehículos industriales en Europa',
  description:
    'Compra, venta, importación, exportación, documentación, transporte y asesoramiento especializado para profesionales del sector industrial en Europa.',
  contact: {
    phone: '+34 601 108 885',
    phoneDisplay: '+34 601 108 885',
    email: 'info@trucksleon.com',
    whatsapp: '+34601108885',
    address: 'Gran Vía de San Marcos, 30',
    city: 'León',
    postalCode: '24001',
    region: 'Castilla y León',
    country: 'España',
    countryCode: 'ES',
    hours: '24 horas / 7 días a la semana',
  },
  social: {
    facebook: 'https://www.facebook.com/trucksleon/',
    whatsapp: 'https://wa.me/34601108885',
  },
  /** Shared Open Graph / Twitter card image, 1200x630. */
  ogImage: {
    path: '/images/og/og-trucksleon.png',
    width: 1200,
    height: 630,
  },
  url: siteUrl,
}

/**
 * Open Graph locale codes.
 *
 * `en_GB` rather than `en_US`: the English edition addresses the European
 * market this company actually trades in (the UK is one of the countries
 * plotted on the Europe map), and its copy uses European conventions.
 */
export const ogLocales: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_GB',
  nl: 'nl_NL',
  de: 'de_DE',
  fr: 'fr_FR',
}
