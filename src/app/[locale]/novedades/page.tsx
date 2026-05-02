import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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
  const t = await getTranslations({ locale })

  return (
    <div className="pt-20 min-h-screen bg-carbon">
      <PageHero
        badge={t('nav.news')}
        title={t('news.title')}
        subtitle={t('news.subtitle')}
      />

      {/* Coming soon notice */}
      <section className="py-16 md:py-20 bg-graphite">
        <Container narrow>
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-accent/10 border border-red-accent/20 text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-6">
                {t('news.comingSoonBadge')}
              </span>
              <p className="text-steel text-lg leading-relaxed max-w-xl mx-auto">
                {t('news.subtitle')}
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {cards.map(({ key, Icon, href }) => (
              <StaggerItem key={key}>
                <Link
                  href={href(locale)}
                  className="group flex flex-col p-6 rounded-xl bg-carbon border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_24px_rgba(215,25,32,0.08)] transition-all duration-300 h-full"
                >
                  <div className="w-11 h-11 rounded-lg bg-red-accent/10 flex items-center justify-center mb-4 group-hover:bg-red-accent/20 transition-colors">
                    <Icon size={20} className="text-red-accent" aria-hidden />
                  </div>
                  <h3 className="font-heading font-bold text-off-white mb-2 text-sm">
                    {t(`news.cards.${key}.title`)}
                  </h3>
                  <p className="text-steel text-xs leading-relaxed mb-4 flex-1">
                    {t(`news.cards.${key}.description`)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-red-accent text-xs font-semibold group-hover:gap-2.5 transition-all">
                    {t(`news.cards.${key}.cta`)}
                    <ArrowRight size={12} aria-hidden />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-carbon border-t border-white/5">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-off-white mb-4">
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
