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
    <div className="pt-20 min-h-screen bg-carbon">
      <PageHero
        badge={t('nav.vehicles')}
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
      />

      {/* Availability notice */}
      <section className="py-8 bg-graphite border-b border-white/5">
        <Container>
          <Reveal>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-red-accent/5 border border-red-accent/15">
              <div className="w-8 h-8 rounded-lg bg-red-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
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
      <section className="py-16 md:py-24 bg-graphite">
        <Container>
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {vehicleCategories.map((cat, index) => {
              const ghostNum = String(index + 1).padStart(2, '0')
              return (
                <StaggerItem key={cat.id}>
                  <Link
                    href={`/${locale}/contacto`}
                    className="group relative flex items-center gap-3 p-4 rounded-xl bg-carbon border border-white/5 hover:border-red-accent/40 hover:bg-red-accent/5 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(215,25,32,0.08)] transition-all duration-200 min-h-[80px] overflow-hidden"
                    title={t(cat.titleKey)}
                  >
                    <span
                      className="absolute bottom-0 right-2 font-mono text-[2.5rem] font-bold text-off-white/[0.05] leading-none select-none pointer-events-none"
                      aria-hidden
                    >
                      {ghostNum}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-accent/15 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Truck
                        size={14}
                        className="text-steel/40 group-hover:text-red-accent transition-colors"
                        aria-hidden
                      />
                    </div>
                    <span className="text-sm font-medium text-steel group-hover:text-off-white transition-colors relative z-10 leading-tight flex-1">
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
      <section className="py-16 md:py-24 bg-carbon">
        <Container narrow>
          <Reveal>
            <div className="p-10 md:p-14 rounded-2xl bg-graphite border border-white/8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03]"
                aria-hidden
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(248,250,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-red-accent/6 rounded-full blur-[80px] pointer-events-none" aria-hidden />
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-off-white mb-4">
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
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors font-medium text-sm"
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
      <section className="py-12 bg-graphite border-t border-white/5">
        <Container>
          <Reveal>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-off-white font-heading font-semibold mb-1">
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
