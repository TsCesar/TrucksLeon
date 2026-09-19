import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight, Truck, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { vehicleCategories } from '@/data/vehicleCategories'
import { siteConfig } from '@/config/site'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'categories' })
  return buildMetadata({ title: t('title'), locale, path: '/vehiculos' })
}

export default async function VehiculosPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <PageHero
        badge={t('nav.vehicles')}
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
      />

      {/* Availability notice */}
      <section className="py-8 bg-surface border-b border-line/[0.07]">
        <Container>
          <Reveal>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-red-accent/[0.04] border border-red-accent/20">
              <div className="w-9 h-9 rounded-lg bg-red-accent/[0.10] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Truck size={16} className="text-red-accent" aria-hidden />
              </div>
              <p className="text-steel text-sm leading-relaxed">
                {t('vehicles.notice')}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Categories grid */}
      <section className="py-16 md:py-24 bg-mist">
        <Container>
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {vehicleCategories.map((cat, index) => {
              const ghostNum = String(index + 1).padStart(2, '0')
              return (
                <StaggerItem key={cat.id}>
                  <Link
                    href={`/${locale}/contacto`}
                    className="group relative flex items-center gap-3 p-4 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/35 hover:bg-red-accent/[0.025] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_16px_34px_-20px_rgb(215_25_32_/_0.30)] transition-all duration-300 ease-out-expo min-h-[84px] overflow-hidden"
                    title={t(cat.titleKey)}
                  >
                    <span
                      className="absolute bottom-0 right-2 font-mono text-[2.5rem] font-bold text-line/[0.05] leading-none select-none pointer-events-none"
                      aria-hidden
                    >
                      {ghostNum}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-line/[0.05] group-hover:bg-red-accent/[0.12] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                      <Truck
                        size={15}
                        className="text-steel/60 group-hover:text-red-accent transition-colors"
                        aria-hidden
                      />
                    </div>
                    <span className="text-sm font-medium text-ink relative z-10 leading-tight flex-1">
                      {t(cat.titleKey)}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-red-accent flex-shrink-0 relative z-10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
                      aria-hidden
                    />
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        </Container>
      </section>

      {/* Consultation CTA */}
      <section className="py-16 md:py-24 bg-surface">
        <Container narrow>
          <Reveal>
            <div className="p-8 sm:p-10 md:p-14 rounded-2xl bg-surface border border-line/[0.09] shadow-float relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent to-transparent" aria-hidden />
              <div className="absolute inset-0 tech-grid-sm opacity-70" aria-hidden />
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[400px] max-w-[90%] h-[200px] bg-red-accent/[0.07] rounded-full blur-[80px] pointer-events-none" aria-hidden />
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 tracking-tight text-balance">
                  {t('vehicles.consultTitle')}
                </h2>
                <p className="text-steel text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                  {t('vehicles.consultDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/${locale}/contacto`}>
                    <Button size="lg" className="group w-full sm:w-auto">
                      {t('common.consultAvailability')}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </Button>
                  </Link>
                  <a
                    href={siteConfig.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-lg bg-[#25D366]/[0.08] border border-[#25D366]/35 text-[#128C4B] shadow-card hover:bg-[#25D366]/[0.14] hover:border-[#25D366]/55 hover:-translate-y-px hover:shadow-lift transition-all duration-300 font-semibold text-sm"
                  >
                    <MessageCircle size={18} aria-hidden />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Link to delivered */}
      <section className="py-12 bg-mist border-t border-line/[0.07]">
        <Container>
          <Reveal>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-ink font-heading font-semibold mb-1 tracking-tight">
                  {t('delivered.title')}
                </h3>
                <p className="text-steel text-sm">{t('delivered.subtitle')}</p>
              </div>
              <Link href={`/${locale}/vehiculos-entregados`} className="flex-shrink-0">
                <Button variant="outline" className="group">
                  {t('vehicles.ctaDelivered')}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
