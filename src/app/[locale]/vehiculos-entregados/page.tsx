import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'delivered' })
  return buildMetadata({ title: t('title'), locale, path: '/vehiculos-entregados' })
}

export default async function VehiculosEntregadosPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <div className="pt-20 min-h-screen bg-carbon">
      <PageHero
        badge={t('nav.delivered')}
        title={t('delivered.title')}
        subtitle={t('delivered.subtitle')}
      />

      <section className="py-16 md:py-24 bg-carbon">
        <Container>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {deliveredVehicles.map((vehicle) => (
              <StaggerItem key={vehicle.id}>
                <DeliveredVehicleCard vehicle={vehicle} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal>
            <div className="text-center">
              <p className="text-steel mb-6 text-sm">{t('trust.availability.description')}</p>
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
