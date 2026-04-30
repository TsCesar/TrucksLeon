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
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Truck
            const ghostNum = String(index + 1).padStart(2, '0')
            return (
              <StaggerItem key={service.id}>
                <div className="group relative p-6 rounded-xl bg-graphite border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_24px_rgba(215,25,32,0.08)] transition-all duration-300 h-full overflow-hidden">
                  {/* Top accent gradient on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                  {/* Ghost number */}
                  <span className="absolute top-1 right-3 font-mono text-[4.5rem] font-bold text-off-white/[0.04] leading-none select-none pointer-events-none" aria-hidden>
                    {ghostNum}
                  </span>
                  <div className="w-11 h-11 rounded-lg bg-red-accent/10 flex items-center justify-center mb-4 group-hover:bg-red-accent/20 transition-colors relative z-10">
                    <Icon size={20} className="text-red-accent" aria-hidden />
                  </div>
                  <h3 className="font-heading font-semibold text-off-white text-sm mb-2 relative z-10">{t(service.titleKey)}</h3>
                  <p className="text-steel text-xs leading-relaxed relative z-10">{t(service.descriptionKey)}</p>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </Section>
  )
}
