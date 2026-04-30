import { useTranslations } from 'next-intl'
import { MessageSquare, Settings, FileText, ArrowLeftRight, PackageOpen, Package, Truck, Map, ShieldCheck, Award, ClipboardList, Stamp } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { services } from '@/data/services'

const iconMap: Record<string, React.ElementType> = {
  MessageSquare, Settings, FileText, ArrowLeftRight, PackageOpen, Package,
  Stamp, Truck, Map, ShieldCheck, Award, ClipboardList,
}

export function ServicesPreview() {
  const t = useTranslations()

  return (
    <Section dark id="servicios">
      <Container>
        <SectionHeader
          badge={t('nav.services')}
          title={t('services.title')}
          subtitle={t('services.subtitle')}
        />
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service) => {
            const Icon = iconMap[service.icon] ?? Truck
            return (
              <StaggerItem key={service.id}>
                <div className="group p-6 rounded-xl bg-graphite border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_24px_rgba(215,25,32,0.08)] transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-lg bg-red-accent/10 flex items-center justify-center mb-4 group-hover:bg-red-accent/20 transition-colors">
                    <Icon size={20} className="text-red-accent" aria-hidden />
                  </div>
                  <h3 className="font-heading font-semibold text-off-white text-sm mb-2">{t(service.titleKey)}</h3>
                  <p className="text-steel text-xs leading-relaxed">{t(service.descriptionKey)}</p>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </Section>
  )
}
