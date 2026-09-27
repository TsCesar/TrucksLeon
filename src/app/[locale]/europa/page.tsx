import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { EuropeRouteMap } from '@/components/animations/EuropeRouteMap'
import { europeanCountries } from '@/data/countries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'europe' })
  return buildMetadata({ title: t('title'), locale, path: '/europa' })
}

export default async function EuropaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <PageHero
        badge={t('europe.badge')}
        title={t('europe.title')}
        subtitle={t('europe.subtitle')}
      />

      {/* Map + content */}
      <section className="py-16 md:py-24 bg-surface">
        <Container>
          {/* The copy column used to be a paragraph, a chip and one line next
              to a map roughly twice its height, which read as an empty half.
              The balance is fixed by composition, not by padding out the text:
              the countries the map already plots are listed as a code grid —
              the same ISO codes the map labels use, so it stays correct in
              every locale. */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            {/* First body block: sits inside the initial viewport on phones, so
                it is the LCP candidate. CSS entry, not a hydration-gated Reveal. */}
            <div className="hero-rise flex h-full flex-col">
              <p className="text-steel text-lg leading-relaxed mb-8">
                {t('europe.description')}
              </p>
              <div className="inline-flex self-start items-center gap-4 px-5 py-4 rounded-xl bg-surface border border-line/[0.09] shadow-card mb-8">
                <span className="font-mono text-3xl font-bold text-red-accent leading-none">+15</span>
                <span className="text-sm text-steel leading-tight">{t('hero.stats.countries')}</span>
              </div>
              <p className="text-steel text-sm leading-relaxed mb-6">
                {t('europe.coverage')}
              </p>

              <ul className="mt-auto grid grid-cols-3 sm:grid-cols-5 gap-2">
                {europeanCountries.map((country) => (
                  <li
                    key={country.code}
                    className="flex items-center justify-center gap-2 rounded-lg border border-line/[0.09] bg-surface px-2 py-2.5 shadow-card"
                  >
                    {/* Code only, no flag emoji: Windows ships no regional-
                        indicator glyphs, so a flag renders there as its two
                        letters — "🇪🇸 ES" would read "ES ES". The ISO code is
                        also what the map itself labels, and needs no locale. */}
                    <span className="w-1.5 h-1.5 rounded-full bg-red-accent/70 flex-shrink-0" aria-hidden />
                    <span className="font-mono text-[11px] font-bold tracking-wider text-steel">
                      {country.code}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Reveal direction="right" delay={0.2} className="h-full">
              <div className="p-3 sm:p-4 rounded-2xl bg-surface border border-line/[0.09] shadow-float">
                <EuropeRouteMap />
                <div className="flex items-center justify-between gap-3 px-2 pt-3 pb-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel/80">
                    {t('europe.badge')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-red-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-accent" aria-hidden />
                    +15
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Services link */}
      <section className="py-16 md:py-20 bg-mist border-t border-line/[0.07]">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 tracking-tight">
                {t('trust.network.title')}
              </h2>
              <p className="text-steel mb-8 max-w-lg mx-auto leading-relaxed">
                {t('trust.network.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${locale}/contacto`}>
                  <Button size="lg" className="group">
                    {t('nav.contactCta')}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Button>
                </Link>
                <Link href={`/${locale}/servicios`}>
                  <Button variant="outline" size="lg" className="group">
                    {t('nav.services')}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
