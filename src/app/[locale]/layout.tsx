import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { MouseGlow } from '@/components/animations/MouseGlow'
import { archivo, plexMono } from '@/lib/fonts'
import { locales, type Locale } from '@/config/locales'
import { buildRootMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import '../globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
}

/**
 * Shared metadata for every localized page: metadataBase, the title template,
 * the icons and the indexing policy. Each page then supplies only its own
 * title, description, canonical, hreflang and social cards.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildRootMetadata(locale)
}

/**
 * Root layout for every localized route.
 *
 * This renders <html> and <body> itself rather than nesting inside a single
 * app/layout.tsx. That is the whole point: `lang` has to be the language of the
 * page, and only this segment knows it. A shared root layout sits above
 * `[locale]` and never receives the param, which is why the site used to
 * declare `lang="es"` on its German, French, Dutch and English pages.
 *
 * `/` gets its own root layout in `src/app/(root)/layout.tsx`.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Opts this subtree into static rendering — without it next-intl falls back to
  // headers(), which a static export cannot provide.
  setRequestLocale(locale)

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'aria' })

  return (
    <html lang={locale} className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <MouseGlow />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScroll />
          {/* #main-content already existed but nothing targeted it: keyboard users
              had to tab past the nine nav items, the language menu and the CTA on
              every page before reaching the content. */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-float"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
