'use client'

import { useTranslations } from 'next-intl'
import { Globe, BarChart3, Clock } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'
import { AnimatedCounter } from '@/components/animations/AnimatedCounter'
import { EuropeRouteMap } from '@/components/animations/EuropeRouteMap'
import { VehicleStreaks } from '@/components/animations/VehicleStreaks'

export function EuropePreview() {
  const t = useTranslations()

  const stats = [
    { icon: Globe, target: 15, prefix: '+', suffix: '', labelKey: 'hero.stats.countries' },
    { icon: BarChart3, target: 100, prefix: '', suffix: '%', labelKey: 'hero.stats.integral' },
    { icon: Clock, target: 24, prefix: '', suffix: '/7', labelKey: 'hero.stats.availability' },
  ] as const

  return (
    <Section tone="red" id="europa" className="relative overflow-hidden">
      <div className="absolute inset-0 tech-hatch opacity-45 pointer-events-none" aria-hidden />
      <VehicleStreaks />
      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal direction="left">
            <div>
              <span className="inline-flex items-center gap-2 text-red-text font-mono text-xs font-semibold tracking-[0.18em] uppercase mb-4">
                <Globe size={12} aria-hidden />
                {t('europe.badge')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-ink mb-6 leading-tight tracking-tight text-balance">
                {t('europe.title')}
              </h2>
              <p className="text-steel text-lg leading-relaxed mb-3">
                {t('europe.subtitle')}
              </p>
              <p className="text-steel leading-relaxed mb-10">
                {t('europe.description')}
              </p>

              {/* Animated stats */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map(({ icon: Icon, target, prefix, suffix, labelKey }) => (
                  <div
                    key={labelKey}
                    className="group p-4 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/28 hover:-translate-y-1 hover:shadow-lift transition-all duration-300 text-center"
                  >
                    <Icon
                      size={15}
                      className="text-red-accent mx-auto mb-2.5 group-hover:scale-110 transition-transform duration-300"
                      aria-hidden
                    />
                    <div className="font-mono text-2xl font-bold text-ink leading-none">
                      <AnimatedCounter
                        target={target}
                        prefix={prefix}
                        suffix={suffix}
                        duration={1800}
                      />
                    </div>
                    <div className="text-[10px] text-steel uppercase tracking-wider mt-1.5 leading-tight">
                      {t(labelKey)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.18}>
            {/* White card holding the one deliberately dark element on the site */}
            <div className="relative p-3 sm:p-4 rounded-2xl bg-surface border border-line/[0.09] shadow-float">
              <EuropeRouteMap />
              <div className="flex items-center justify-between gap-3 px-2 pt-3 pb-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel/80">
                  {t('europe.badge')}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-red-text">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-accent" aria-hidden />
                  +15
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
