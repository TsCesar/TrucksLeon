import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { vehicleCategories } from '@/data/vehicleCategories'

export function VehicleCategoriesPreview() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <Section id="categorias">
      <Container>
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
                  className="group relative flex items-center justify-between p-4 rounded-xl bg-graphite border border-white/5 hover:border-red-accent/30 hover:bg-red-accent/5 hover:-translate-y-0.5 transition-all duration-200 min-h-[90px] overflow-hidden"
                >
                  {/* Ghost number */}
                  <span className="absolute bottom-1 left-3 font-mono text-[3rem] font-bold text-off-white/[0.05] leading-none select-none pointer-events-none" aria-hidden>
                    {ghostNum}
                  </span>
                  <span className="text-sm font-medium text-steel group-hover:text-off-white transition-colors relative z-10">
                    {t(cat.titleKey)}
                  </span>
                  <ArrowRight size={14} className="text-red-accent flex-shrink-0 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden />
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </Section>
  )
}
