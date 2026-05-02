import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Globe, Settings, FileText, Network, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return buildMetadata({ title: t('title'), locale, path: '/quienes-somos' })
}

const strengthKeys = [
  { key: 'european', Icon: Globe },
  { key: 'integral', Icon: Settings },
  { key: 'documentation', Icon: FileText },
  { key: 'network', Icon: Network },
] as const

export default async function QuienesSomosPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <div className="pt-20 min-h-screen bg-carbon">
      <PageHero
        badge={t('nav.about')}
        title={t('about.title')}
        subtitle={t('about.subtitle')}
      />

      {/* Positioning block */}
      <section className="py-16 md:py-24 bg-graphite">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <Reveal direction="left">
              <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
                {t('about.positioning.badge')}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-off-white mb-5 leading-tight">
                {t('about.positioning.title')}
              </h2>
              <p className="text-steel text-lg leading-relaxed mb-4">
                {t('about.description')}
              </p>
              <p className="text-steel leading-relaxed mb-8">
                {t('about.positioning.description')}
              </p>
              <Link href={`/${locale}/contacto`}>
                <Button className="group">
                  {t('about.positioning.cta')}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
            </Reveal>

            <Reveal direction="right" delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {(['experience', 'transparency', 'commitment', 'professionalism'] as const).map((val) => (
                  <div
                    key={val}
                    className="p-5 rounded-xl bg-carbon border border-white/5 flex flex-col gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-accent" aria-hidden />
                    <span className="text-off-white font-heading font-semibold text-sm">
                      {t(`about.values.${val}`)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Strengths */}
      <section className="py-16 md:py-24 bg-carbon">
        <Container>
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-off-white mb-4">
                {t('about.strengths.title')}
              </h2>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {strengthKeys.map(({ key, Icon }) => (
              <StaggerItem key={key}>
                <div className="group p-6 rounded-xl bg-graphite border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_24px_rgba(215,25,32,0.08)] transition-all duration-300 h-full">
                  <div className="w-11 h-11 rounded-lg bg-red-accent/10 flex items-center justify-center mb-4 group-hover:bg-red-accent/20 transition-colors">
                    <Icon size={20} className="text-red-accent" aria-hidden />
                  </div>
                  <h3 className="font-heading font-bold text-off-white mb-2 text-sm">
                    {t(`about.strengths.${key}.title`)}
                  </h3>
                  <p className="text-steel text-xs leading-relaxed">
                    {t(`about.strengths.${key}.description`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-graphite border-t border-white/5">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-off-white mb-4">
                {t('trust.availability.title')}
              </h2>
              <p className="text-steel mb-8 max-w-md mx-auto">
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
