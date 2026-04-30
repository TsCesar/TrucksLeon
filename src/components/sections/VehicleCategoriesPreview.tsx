import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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
          {vehicleCategories.map((cat) => (
            <StaggerItem key={cat.id}>
              <Link
                href={`/${locale}/vehiculos?categoria=${cat.slug}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-graphite border border-white/5 hover:border-red-accent/30 hover:bg-red-accent/5 transition-all duration-200"
              >
                <span className="text-sm font-medium text-steel group-hover:text-off-white transition-colors">
                  {t(cat.titleKey)}
                </span>
                <ChevronRight size={14} className="text-steel group-hover:text-red-accent transition-colors flex-shrink-0" aria-hidden />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  )
}
