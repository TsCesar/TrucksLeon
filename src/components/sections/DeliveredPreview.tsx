import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { deliveredVehicles } from '@/data/deliveredVehicles'

export function DeliveredPreview() {
  const t = useTranslations()
  const locale = useLocale()
  const featured = deliveredVehicles.filter((v) => v.image).slice(0, 6)

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
              <div className="group rounded-xl overflow-hidden bg-graphite border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_30px_rgba(215,25,32,0.1)] transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {vehicle.image ? (
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-graphite flex items-center justify-center">
                      <span className="text-steel text-sm">{vehicle.brand}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="red">{t('delivered.badge')}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-off-white font-heading font-semibold text-sm leading-tight">{vehicle.name}</p>
                  {vehicle.specs && (
                    <p className="text-steel text-xs font-mono mt-1">{vehicle.specs}</p>
                  )}
                </div>
              </div>
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
