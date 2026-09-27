import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { RoomEntry } from '@/components/animations/RoomEntry'
import { VehicleStreaks } from '@/components/animations/VehicleStreaks'
import { DeliveredVehicleCard } from '@/components/vehicles/DeliveredVehicleCard'
import { deliveredVehicles } from '@/data/deliveredVehicles'

export function DeliveredPreview() {
  const t = useTranslations()
  const locale = useLocale()
  // Six covers on the home page; the full set (and every gallery) lives on
  // /vehiculos-entregados, so the landing page never pulls twelve galleries.
  const featured = deliveredVehicles.slice(0, 6)

  return (
    <Section tone="surface" id="entregados" className="relative overflow-hidden">
      <VehicleStreaks />
      <Container className="relative">
        <RoomEntry tiltX={6} tiltY={-2}>
          {/* The header must stay a full-width centred block like every other
              section on the page. It used to share a justify-between row with
              the counter, which shrank it and left the centred badge and
              subtitle floating off-axis from the title. */}
          <SectionHeader
            badge={t('nav.delivered')}
            title={t('delivered.title')}
            subtitle={t('delivered.subtitle')}
          />
          <div className="flex justify-end mb-3">
            <span className="font-mono text-steel/70 text-xs" aria-hidden>
              {deliveredVehicles.length}&nbsp;{t('delivered.statsCount')}
            </span>
          </div>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {featured.map((vehicle) => (
              <StaggerItem key={vehicle.id} className="h-full">
                <DeliveredVehicleCard vehicle={vehicle} />
              </StaggerItem>
            ))}
          </Stagger>
          <div className="flex justify-center">
            <Link href={`/${locale}/vehiculos-entregados`} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="group w-full sm:w-auto">
                {t('delivered.cta')}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Button>
            </Link>
          </div>
        </RoomEntry>
      </Container>
    </Section>
  )
}
