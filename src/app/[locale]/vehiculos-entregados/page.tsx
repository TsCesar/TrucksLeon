import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { DeliveredVehicleCard } from '@/components/vehicles/DeliveredVehicleCard'
import { deliveredVehicles } from '@/data/deliveredVehicles'
import { buildMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({ locale, page: 'delivered' })
}

export default async function VehiculosEntregadosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <JsonLd locale={locale} page="delivered" />
      <PageHero
        badge={t('nav.delivered')}
        title={t('delivered.title')}
        subtitle={t('delivered.subtitle')}
      />

      {/* Stats strip */}
      <div className="bg-surface border-b border-line/[0.07]">
        <Container>
          <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: deliveredVehicles.length.toString(), label: t('delivered.statsCount') },
              { value: '+15', label: t('delivered.statsCountries') },
              { value: '100%', label: t('delivered.statsDoc') },
              { value: '24/7', label: t('delivered.statsSupport') },
            ].map(({ value, label }) => (
              <div key={label} className="text-center py-2 sm:border-r sm:border-line/[0.07] sm:last:border-r-0">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-red-accent font-mono tracking-tight">
                  {value}
                </div>
                <div className="text-xs text-steel uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <section className="py-16 md:py-24 bg-mist">
        <Container>
          {/* Names the grid for screen readers and keeps the heading outline
              contiguous: the cards below are <h3>. */}
          <h2 className="sr-only">{t('aria.deliveredList')}</h2>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {deliveredVehicles.map((vehicle) => (
              <StaggerItem key={vehicle.id} className="h-full">
                <DeliveredVehicleCard vehicle={vehicle} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal>
            <div className="text-center">
              <p className="text-steel mb-6 text-sm">{t('trust.availability.description')}</p>
              <Link className="inline-flex" href={`/${locale}/contacto`}>
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
