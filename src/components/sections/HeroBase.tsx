'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedTruckLine } from '@/components/animations/AnimatedTruckLine'

export function HeroBase() {
  const t = useTranslations()
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
  })

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-carbon" aria-label="Hero">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-truck-main.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/80 to-carbon/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
      </div>

      {/* Grid lines decoration */}
      <div className="absolute inset-0 z-0 opacity-5" aria-hidden>
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(248,250,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Red accent line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-red-accent to-transparent z-10" aria-hidden />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.div {...fadeUp(0.1)}>
            <Badge className="mb-6">{t('hero.badge')}</Badge>
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-off-white leading-tight mb-6"
          >
            {t('hero.claim')}
          </motion.h1>

          <motion.p
            {...fadeUp(0.35)}
            className="text-lg md:text-xl text-steel leading-relaxed mb-10 max-w-2xl"
          >
            {t('hero.subclaim')}
          </motion.p>

          <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/contacto`}>
              <Button size="lg" className="group w-full sm:w-auto">
                {t('hero.ctaPrimary')}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Button>
            </Link>
            <Link href={`/${locale}/vehiculos-entregados`}>
              <Button variant="secondary" size="lg" className="group w-full sm:w-auto">
                {t('hero.ctaSecondary')}
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.65)} className="mt-16 flex flex-wrap gap-8">
            {[
              { value: '+15', label: 'países europeos' },
              { value: '24/7', label: 'disponibilidad' },
              { value: '100%', label: 'gestión integral' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-heading font-bold text-red-accent font-mono">{stat.value}</div>
                <div className="text-xs text-steel uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatedTruckLine />
    </section>
  )
}
