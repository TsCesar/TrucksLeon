import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import {
  MessageSquare, Settings, FileText, ArrowLeftRight,
  PackageOpen, Package, Truck, Map, ShieldCheck, Award, ClipboardList, Stamp,
  ArrowRight,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { services } from '@/data/services'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  return buildMetadata({ title: t('title'), locale, path: '/servicios' })
}

const iconMap: Record<string, React.ElementType> = {
  MessageSquare, Settings, FileText, ArrowLeftRight, PackageOpen, Package,
  Stamp, Truck, Map, ShieldCheck, Award, ClipboardList,
}

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <div className="pt-20 min-h-screen bg-carbon">
      <PageHero
        badge={t('nav.services')}
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      {/* Services grid */}
      <section className="py-16 md:py-24 bg-graphite">
        <Container>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] ?? Truck
              const ghostNum = String(index + 1).padStart(2, '0')
              return (
                <StaggerItem key={service.id}>
                  <div className="group relative p-6 rounded-xl bg-carbon border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_24px_rgba(215,25,32,0.08)] transition-all duration-300 h-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                    <span className="absolute top-1 right-3 font-mono text-[4.5rem] font-bold text-off-white/[0.04] leading-none select-none pointer-events-none" aria-hidden>
                      {ghostNum}
                    </span>
                    <div className="w-11 h-11 rounded-lg bg-red-accent/10 flex items-center justify-center mb-4 group-hover:bg-red-accent/20 transition-colors relative z-10">
                      <Icon size={20} className="text-red-accent" aria-hidden />
                    </div>
                    <h3 className="font-heading font-semibold text-off-white text-sm mb-2 relative z-10">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-steel text-xs leading-relaxed relative z-10">
                      {t(service.descriptionKey)}
                    </p>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </Container>
      </section>

      {/* Trust blocks */}
      <section className="py-16 md:py-20 bg-carbon">
        <Container>
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-off-white mb-4">
                {t('trust.title')}
              </h2>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(['experience', 'transparency', 'availability', 'network'] as const).map((key) => (
              <StaggerItem key={key}>
                <div className="p-6 rounded-xl bg-graphite border border-white/5 h-full">
                  <div className="w-2 h-2 rounded-full bg-red-accent mb-4" aria-hidden />
                  <h3 className="font-heading font-semibold text-off-white text-sm mb-2">
                    {t(`trust.${key}.title`)}
                  </h3>
                  <p className="text-steel text-xs leading-relaxed">
                    {t(`trust.${key}.description`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-graphite border-t border-white/5">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-off-white mb-4">
                {t('trust.availability.title')}
              </h2>
              <p className="text-steel mb-8 max-w-md mx-auto leading-relaxed">
                {t('contact.description')}
              </p>
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
