import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/Container'
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
      <div className="py-20 md:py-28 bg-graphite border-b border-white/8">
        <Container>
          <Reveal>
            <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              {t('nav.delivered')}
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-off-white mb-6">{t('delivered.title')}</h1>
            <p className="text-steel text-xl max-w-2xl">{t('delivered.subtitle')}</p>
          </Reveal>
        </Container>
      </div>
      <Container className="py-16 md:py-24">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deliveredVehicles.map((vehicle) => (
            <StaggerItem key={vehicle.id}>
              <DeliveredVehicleCard vehicle={vehicle} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  )
}
