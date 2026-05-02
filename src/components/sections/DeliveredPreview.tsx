import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { DeliveredVehicleCard } from '@/components/vehicles/DeliveredVehicleCard'
import { deliveredVehicles } from '@/data/deliveredVehicles'

export function DeliveredPreview() {
  const t = useTranslations()
  const locale = useLocale()
  // Show up to 6; prefer those with images but include imageless ones to fill grid
  const featured = [
    ...deliveredVehicles.filter((v) => v.image),
    ...deliveredVehicles.filter((v) => !v.image),
  ].slice(0, 6)

  return (
    <Section dark id="entregados">
      <Container>
        <SectionHeader
          badge={t('nav.delivered')}
          title={t('delivered.title')}
          subtitle={t('delivered.subtitle')}
        />
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {featured.map((vehicle) => (
            <StaggerItem key={vehicle.id}>
              <DeliveredVehicleCard vehicle={vehicle} />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="text-center">
          <Link href={`/${locale}/vehiculos-entregados`}>
            <Button variant="outline" size="lg" className="group">
              {t('delivered.cta')}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  )
}
