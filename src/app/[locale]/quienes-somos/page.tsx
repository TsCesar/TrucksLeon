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
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <PageHero
        badge={t('nav.about')}
        title={t('about.title')}
        subtitle={t('about.subtitle')}
      />

      {/* Positioning block */}
      <section className="py-16 md:py-24 bg-surface">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <Reveal direction="left">
              <span className="inline-flex items-center gap-2 text-red-text font-mono text-xs font-semibold tracking-[0.18em] uppercase mb-4">
                <span className="w-5 h-px bg-red-accent/60" aria-hidden />
                {t('about.positioning.badge')}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-ink mb-5 leading-tight tracking-tight text-balance">
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
                    className="p-5 rounded-xl bg-surface border border-line/[0.09] shadow-card flex flex-col gap-2 hover:border-red-accent/25 hover:shadow-lift transition-all duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-accent" aria-hidden />
                    <span className="text-ink font-heading font-semibold text-sm">
                      {t(`about.values.${val}`)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Timeline milestones */}
      <section className="py-16 md:py-20 bg-mist overflow-hidden">
        <Container>
          <Reveal>
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-[22px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-line/15 to-transparent" aria-hidden />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                {([
                  { num: '01', key: 'contact' },
                  { num: '02', key: 'search' },
                  { num: '03', key: 'management' },
                  { num: '04', key: 'delivery' },
                ] as const).map(({ num, key }, i) => (
                  <div key={key} className="flex flex-col items-start md:items-center text-left md:text-center gap-3">
                    <div className="relative flex items-center justify-center w-11 h-11 rounded-full border border-red-accent/35 bg-surface shadow-card flex-shrink-0">
                      <span className="font-mono text-xs font-bold text-red-text">{num}</span>
                      <div className="absolute inset-0 rounded-full bg-red-accent/10 animate-ping" style={{ animationDuration: `${3 + i * 0.5}s` }} aria-hidden />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-ink text-sm mb-1">
                        {t(`process.steps.${key}.title`)}
                      </h4>
                      <p className="text-steel text-xs leading-relaxed max-w-[180px] mx-auto md:mx-auto">
                        {t(`process.steps.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Strengths */}
      <section className="py-16 md:py-24 bg-surface">
        <Container>
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-4 tracking-tight">
                {t('about.strengths.title')}
              </h2>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {strengthKeys.map(({ key, Icon }) => (
              <StaggerItem key={key}>
                <div className="group p-6 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/30 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_18px_40px_-22px_rgb(215_25_32_/_0.28)] transition-all duration-300 ease-out-expo h-full">
                  <div className="w-11 h-11 rounded-lg bg-red-accent/[0.08] ring-1 ring-red-accent/12 flex items-center justify-center mb-4 group-hover:bg-red-accent/[0.14] group-hover:ring-red-accent/25 transition-all duration-300">
                    <Icon size={20} className="text-red-accent" aria-hidden />
                  </div>
                  <h3 className="font-heading font-bold text-ink mb-2 text-sm">
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
      <section className="py-16 md:py-20 bg-mist border-t border-line/[0.07]">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 tracking-tight">
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
