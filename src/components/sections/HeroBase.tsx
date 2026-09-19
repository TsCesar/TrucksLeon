'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'motion/react'
import { ArrowRight, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedTruckLine } from '@/components/animations/AnimatedTruckLine'

/**
 * Light hero. Depth comes from stacked layers, not from a dark ground:
 * white→mist wash, technical grid, a studio bloom under the tractor unit,
 * two faint red blooms, corner brackets, a slow light sweep, and the
 * TrucksLeón trailer running across the bottom band.
 */
export function HeroBase() {
  const t = useTranslations()
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const rawBgY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const bgY = useSpring(rawBgY, { stiffness: 60, damping: 20, restDelta: 0.001 })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -60])

  const ease = [0.16, 1, 0.3, 1] as const

  const fadeBlurUp = (delay: number) => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 28, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.95, delay, ease },
  })

  const stats = [
    { value: '+15', labelKey: 'hero.stats.countries' },
    { value: '24/7', labelKey: 'hero.stats.availability' },
    { value: '100%', labelKey: 'hero.stats.integral' },
  ] as const

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-gradient-to-br from-surface via-canvas to-mist"
      aria-label="Hero"
    >
      {/* Technical grid — sits above the image layer so the rule spacing runs
          unbroken across the whole hero, including over the tractor unit */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none tech-grid"
        aria-hidden
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 88%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 88%)',
        }}
      />

      {/* Soft red blooms — barely there, just enough to warm the whites */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute left-[-20%] top-[4%] w-[640px] h-[640px] max-w-[100vw] rounded-full bg-red-accent/[0.032] blur-[160px]" />
        <div className="absolute right-[-8%] bottom-[14%] w-[420px] h-[420px] max-w-[90vw] rounded-full bg-red-accent/[0.028] blur-[120px]" />
      </div>

      {/* Tractor unit — parallax, on its own light "studio floor" */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[62%] lg:w-[58%] z-[1] pointer-events-none overflow-hidden" aria-hidden>
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={prefersReducedMotion ? {} : { y: bgY }}
        >
          {/* Studio backdrop so the white cab reads against the white page */}
          <div
            className="absolute right-[2%] top-1/2 -translate-y-1/2 w-[86%] aspect-square rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 52%, rgb(var(--c-line) / 0.10) 0%, rgb(var(--c-line) / 0.045) 42%, transparent 68%)',
            }}
          />
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-end pr-[2%] md:pr-[4%]"
          >
            <div className="relative w-[92%] max-w-[640px] aspect-[640/501] opacity-[0.32] sm:opacity-[0.45] md:opacity-90">
              <Image
                src="/images/hero/hero-truck-main.png"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 92vw, 58vw"
                className="object-contain"
                style={{ filter: 'drop-shadow(0 34px 42px rgb(15 23 42 / 0.16))' }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Scrim: keeps the copy column clean whatever the image does */}
        <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/45 to-transparent md:from-canvas/85 md:via-canvas/15 md:to-transparent" />
      </div>

      {/* Corner brackets */}
      {(['top-0 left-0', 'top-0 right-0', 'bottom-[60px] left-0', 'bottom-[60px] right-0'] as const).map((pos, idx) => (
        <motion.svg
          key={idx}
          className={`absolute w-10 h-10 z-[2] ${pos}`}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0 + idx * 0.12 }}
        >
          <path
            d={
              pos.includes('right') && pos.includes('top') ? 'M20 0 L40 0 L40 20' :
              pos.includes('right') ? 'M20 40 L40 40 L40 20' :
              pos.includes('top') ? 'M0 20 L0 0 L20 0' :
              'M0 20 L0 40 L20 40'
            }
            stroke="rgb(215 25 32 / 0.28)"
            strokeWidth="1.5"
          />
        </motion.svg>
      ))}

      {/* Cinematic light sweep */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            'linear-gradient(112deg, transparent 25%, rgb(255 255 255 / 0.55) 46%, rgb(215 25 32 / 0.035) 53%, transparent 72%)',
        }}
        animate={prefersReducedMotion ? {} : { x: ['-120%', '240%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear', repeatDelay: 12 }}
        aria-hidden
      />

      {/* Left accent line — animated entry */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-accent to-transparent z-10"
        aria-hidden
        initial={prefersReducedMotion ? {} : { scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.1, ease }}
        style={{ originY: 0.5 }}
      />

      {/* Content — fades + rises as the hero scrolls away */}
      <motion.div
        className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-[11.5rem] sm:pb-[14rem] lg:pb-[17.5rem] will-change-transform"
        style={prefersReducedMotion ? {} : { opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-[34rem] lg:max-w-3xl">
          <motion.div {...fadeBlurUp(0.1)}>
            <Badge variant="outline" className="mb-6 gap-2 shadow-card">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-red-accent block flex-shrink-0"
                animate={prefersReducedMotion ? {} : { opacity: [1, 0.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden
              />
              {t('hero.badge')}
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeBlurUp(0.22)}
            className="text-[2.4rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[3.9rem] xl:text-[4.4rem] font-heading font-bold text-ink leading-[1.03] tracking-[-0.03em] mb-5 text-balance"
          >
            {t('hero.claim')}
          </motion.h1>

          <motion.p
            {...fadeBlurUp(0.38)}
            className="text-base md:text-lg lg:text-xl text-steel leading-relaxed mb-8 max-w-xl"
          >
            {t('hero.subclaim')}
          </motion.p>

          <motion.div {...fadeBlurUp(0.52)} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
          <div className="mt-9 sm:mt-11">
            <div className="grid grid-cols-3 sm:hidden gap-2">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.labelKey}
                  className="text-center"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 18, scale: 0.86 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.75 + i * 0.14, ease }}
                >
                  <div className="text-2xl font-heading font-bold text-red-accent font-mono tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-steel uppercase tracking-wide mt-1.5 leading-tight">
                    {t(stat.labelKey)}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="hidden sm:flex items-start divide-x divide-line/12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.labelKey}
                  className={i === 0 ? 'pr-8' : 'px-8'}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 18, scale: 0.86 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.75 + i * 0.14, ease }}
                >
                  <div className="text-3xl font-heading font-bold text-red-accent font-mono tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-steel uppercase tracking-wider mt-2">
                    {t(stat.labelKey)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatedTruckLine />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        aria-hidden
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={prefersReducedMotion ? {} : { opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center gap-2 text-steel/60">
          <span className="font-mono text-[10px] tracking-widest uppercase">scroll</span>
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
