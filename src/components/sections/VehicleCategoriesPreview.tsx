import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, Truck } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { RoomEntry } from '@/components/animations/RoomEntry'
import { vehicleCategories } from '@/data/vehicleCategories'

export function VehicleCategoriesPreview() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <Section tone="surface" id="categorias">
      <Container>
        <RoomEntry tiltX={5} tiltY={3}>
        <SectionHeader
          badge={t('nav.vehicles')}
          title={t('categories.title')}
          subtitle={t('categories.subtitle')}
        />
        <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {vehicleCategories.map((cat, index) => {
            const ghostNum = String(index + 1).padStart(2, '0')
            return (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/${locale}/vehiculos?categoria=${cat.slug}`}
                  className="group relative flex items-center gap-3 p-4 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/35 hover:bg-red-accent/[0.025] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_16px_34px_-20px_rgb(215_25_32_/_0.30)] transition-all duration-300 ease-out-expo min-h-[84px] overflow-hidden"
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-accent rounded-l-xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"
                    aria-hidden
                  />

                  {/* Ghost number */}
                  <span
                    className="absolute bottom-0 right-2 font-mono text-[2.5rem] font-bold text-line/[0.05] leading-none select-none pointer-events-none group-hover:text-red-accent/[0.10] transition-colors duration-300"
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
        </RoomEntry>
      </Container>
    </Section>
  )
}
