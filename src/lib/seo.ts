import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

type SeoProps = {
  title?: string
  description?: string
  locale?: string
  path?: string
}

export function buildMetadata({ title, description, locale = 'es', path = '' }: SeoProps): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const fullDescription = description ?? siteConfig.description
  const url = `${siteConfig.url}/${locale}${path}`

  return {
    title: { absolute: fullTitle },
    description: fullDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        es: `${siteConfig.url}/es${path}`,
        en: `${siteConfig.url}/en${path}`,
        nl: `${siteConfig.url}/nl${path}`,
        de: `${siteConfig.url}/de${path}`,
        fr: `${siteConfig.url}/fr${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: siteConfig.name,
      locale,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
