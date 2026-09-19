import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight, Truck, Globe, FileText } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return buildMetadata({ title: t('news'), locale, path: '/novedades' })
}

const cards = [
  {
    key: 'delivered' as const,
    Icon: Truck,
    href: (locale: string) => `/${locale}/vehiculos-entregados`,
  },
  {
    key: 'european' as const,
    Icon: Globe,
    href: (locale: string) => `/${locale}/europa`,
  },
  {
    key: 'import' as const,
    Icon: FileText,
    href: (locale: string) => `/${locale}/servicios`,
  },
]

export default async function NovedadesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <PageHero
        badge={t('nav.news')}
        title={t('news.title')}
        subtitle={t('news.subtitle')}
      />

      {/* Coming soon notice */}
      <section className="py-16 md:py-20 bg-mist">
        <Container>
          {/* Section header */}
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="inline-flex items-center gap-2 text-red-text font-mono text-xs font-semibold tracking-[0.18em] uppercase mb-4">
                <span className="w-5 h-px bg-red-accent/60" aria-hidden />
                {t('nav.news')}
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 tracking-tight">
                {t('news.title')}
              </h2>
              <p className="text-steel leading-relaxed">
                {t('news.subtitle')}
              </p>
            </div>
          </Reveal>

          {/* Main cards - bigger, more visual */}
          <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {cards.map(({ key, Icon, href }, idx) => (
              <StaggerItem key={key}>
                <Link
                  href={href(locale)}
                  className="group relative flex flex-col p-7 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/30 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_18px_40px_-22px_rgb(215_25_32_/_0.28)] transition-all duration-300 ease-out-expo h-full overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                  <div className="absolute bottom-3 right-3 font-mono text-[5rem] font-bold text-line/[0.05] leading-none select-none pointer-events-none" aria-hidden>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-accent/[0.08] ring-1 ring-red-accent/12 flex items-center justify-center mb-5 group-hover:bg-red-accent/[0.14] group-hover:ring-red-accent/25 group-hover:scale-105 transition-all duration-300 relative z-10">
                    <Icon size={22} className="text-red-accent" aria-hidden />
                  </div>
                  <h3 className="font-heading font-bold text-ink mb-2 relative z-10">
                    {t(`news.cards.${key}.title`)}
                  </h3>
                  <p className="text-steel text-sm leading-relaxed mb-5 flex-1 relative z-10">
                    {t(`news.cards.${key}.description`)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-red-text text-xs font-semibold group-hover:gap-3 transition-all relative z-10">
                    {t(`news.cards.${key}.cta`)}
                    <ArrowRight size={13} aria-hidden />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface border-t border-line/[0.07]">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-ink mb-4 tracking-tight">
                {t('trust.availability.title')}
              </h2>
              <p className="text-steel mb-8 max-w-md mx-auto text-sm leading-relaxed">
                {t('trust.availability.description')}
              </p>
              <Link href={`/${locale}/contacto`}>
                <Button size="lg" className="group">
                  {t('nav.contactCta')}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
