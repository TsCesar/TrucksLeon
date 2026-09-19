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
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <PageHero
        badge={t('nav.services')}
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      {/* Services grid */}
      <section className="py-16 md:py-24 bg-mist">
        <Container>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] ?? Truck
              const ghostNum = String(index + 1).padStart(2, '0')
              return (
                <StaggerItem key={service.id}>
                  <div className="group relative p-6 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/30 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_18px_40px_-22px_rgb(215_25_32_/_0.28)] transition-all duration-300 ease-out-expo h-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                    <span className="absolute top-1 right-3 font-mono text-[4.5rem] font-bold text-line/[0.05] leading-none select-none pointer-events-none" aria-hidden>
                      {ghostNum}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-red-accent/[0.08] ring-1 ring-red-accent/12 flex items-center justify-center mb-4 group-hover:bg-red-accent/[0.14] group-hover:ring-red-accent/25 group-hover:scale-105 transition-all duration-300 relative z-10">
                      <Icon size={20} className="text-red-accent" aria-hidden />
                    </div>
                    <h3 className="font-heading font-semibold text-ink text-sm mb-2 relative z-10">
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
      <section className="py-16 md:py-20 bg-surface">
        <Container>
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 tracking-tight">
                {t('trust.title')}
              </h2>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(['experience', 'transparency', 'availability', 'network'] as const).map((key) => (
              <StaggerItem key={key}>
                <div className="p-6 rounded-xl bg-surface border border-line/[0.09] shadow-card h-full hover:border-red-accent/25 hover:shadow-lift transition-all duration-300">
                  <div className="w-2 h-2 rounded-full bg-red-accent mb-4" aria-hidden />
                  <h3 className="font-heading font-semibold text-ink text-sm mb-2">
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
      <section className="py-16 bg-mist border-t border-line/[0.07]">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 tracking-tight">
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
