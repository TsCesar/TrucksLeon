'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedTruckLine } from '@/components/animations/AnimatedTruckLine'
import { TechnicalLines } from '@/components/animations/TechnicalLines'

export function HeroBase() {
  const t = useTranslations()
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()

  const ease = [0.22, 1, 0.36, 1] as const

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
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
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/85 to-carbon/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/70" />
      </div>

      {/* Technical overlay */}
      <TechnicalLines className="z-[1]" lineCount={4} />

      {/* Grid lines */}
      <div className="absolute inset-0 z-[1] opacity-[0.04]" aria-hidden>
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(248,250,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Animated left accent line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-accent to-transparent z-10"
        aria-hidden
        initial={prefersReducedMotion ? {} : { scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease }}
        style={{ originY: 0.5 }}
      />

      {/* Red radial glow */}
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.div {...fadeUp(0.1)}>
            <Badge className="mb-6">{t('hero.badge')}</Badge>
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-heading font-bold text-off-white leading-[1.05] tracking-tight mb-6"
          >
            {t('hero.claim')}
          </motion.h1>

          <motion.p
            {...fadeUp(0.35)}
            className="text-lg md:text-xl text-steel leading-relaxed mb-10 max-w-2xl"
          >
            {t('hero.subclaim')}
          </motion.p>

          <motion.div {...fadeUp(0.5)} className="flex flex-col xs:flex-row gap-4">
            <Link href={`/${locale}/contacto`}>
              <Button size="lg" className="group w-full xs:w-auto">
                {t('hero.ctaPrimary')}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Button>
            </Link>
            <Link href={`/${locale}/vehiculos-entregados`}>
              <Button variant="secondary" size="lg" className="group w-full xs:w-auto">
                {t('hero.ctaSecondary')}
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Button>
            </Link>
          </motion.div>

          {/* Stats - horizontal with dividers */}
          <motion.div {...fadeUp(0.65)} className="mt-16 flex items-start divide-x divide-white/10">
            {([
              { value: '+15', labelKey: 'hero.stats.countries' },
              { value: '24/7', labelKey: 'hero.stats.availability' },
              { value: '100%', labelKey: 'hero.stats.integral' },
            ] as const).map((stat, i) => (
              <div key={stat.labelKey} className={i === 0 ? 'pr-8' : 'px-8'}>
                <div className="text-3xl font-heading font-bold text-red-accent font-mono tracking-tight">{stat.value}</div>
                <div className="text-xs text-steel uppercase tracking-wider mt-1">{t(stat.labelKey)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatedTruckLine />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-steel/40"
        aria-hidden
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
