import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { EuropeRouteMap } from '@/components/animations/EuropeRouteMap'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'europe' })
  return buildMetadata({ title: t('title'), locale, path: '/europa' })
}

export default async function EuropaPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <div className="pt-20 min-h-screen bg-carbon">
      <PageHero
        badge={t('europe.badge')}
        title={t('europe.title')}
        subtitle={t('europe.subtitle')}
      />

      {/* Map + content */}
      <section className="py-16 md:py-24 bg-carbon">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal direction="left">
              <p className="text-steel text-lg leading-relaxed mb-8">
                {t('europe.description')}
              </p>
              <div className="inline-flex items-center gap-4 px-5 py-4 rounded-xl bg-graphite/60 border border-white/5 mb-8">
                <span className="font-mono text-3xl font-bold text-red-accent leading-none">+15</span>
                <span className="text-sm text-steel leading-tight">{t('hero.stats.countries')}</span>
              </div>
              <p className="text-steel/70 text-sm leading-relaxed">
                {t('europe.coverage')}
              </p>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <div className="p-6 rounded-2xl bg-graphite/40 border border-white/5">
                <EuropeRouteMap />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Services link */}
      <section className="py-16 md:py-20 bg-graphite border-t border-white/5">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-off-white mb-4">
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
