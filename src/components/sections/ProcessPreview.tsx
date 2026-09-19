'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'

const steps = ['contact', 'search', 'management', 'delivery'] as const

type Props = { showHeader?: boolean }

export function ProcessPreview({ showHeader = true }: Props) {
  const t = useTranslations()
  const prefersReducedMotion = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start 0.85', 'center 0.45'],
  })

  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <Section tone="mist" id="proceso">
      <Container>
        {showHeader && (
          <SectionHeader
            badge={t('nav.process')}
            title={t('process.title')}
            subtitle={t('process.subtitle')}
          />
        )}
        <div className="relative" ref={gridRef}>
          {/* Scroll-linked progress line — desktop only */}
          {!prefersReducedMotion && (
            <div
              className="hidden lg:block absolute top-[28px] h-px bg-line/[0.10] z-0 overflow-hidden"
              style={{ left: 'calc(12.5% + 18px)', right: 'calc(12.5% + 18px)' }}
              aria-hidden
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-accent/80 via-red-accent to-red-accent/30 origin-left"
                style={{ scaleX: lineScaleX }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step} direction="up" delay={i * 0.1}>
                <div className="group relative p-6 rounded-xl bg-surface border border-line/[0.09] shadow-card h-full overflow-hidden hover:-translate-y-1.5 hover:border-red-accent/28 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_20px_44px_-24px_rgb(215_25_32_/_0.28)] transition-all duration-300 ease-out-expo">
                  {/* Big ghost number */}
                  <span
                    className="absolute -bottom-2 -right-1 font-mono font-bold text-line/[0.045] leading-none select-none pointer-events-none group-hover:text-red-accent/[0.09] transition-colors duration-500"
                    style={{ fontSize: '6rem' }}
                    aria-hidden
                  >
                    {t(`process.steps.${step}.number`)}
                  </span>

                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full border border-red-accent/40 bg-red-accent/[0.05] flex items-center justify-center flex-shrink-0 group-hover:border-red-accent group-hover:bg-red-accent/[0.12] transition-all duration-300">
                      <span className="font-mono text-xs font-bold text-red-text leading-none">
                        {t(`process.steps.${step}.number`)}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-accent/45 to-transparent" aria-hidden />
                  </div>

                  <h3 className="font-heading font-bold text-ink mb-3 relative z-10">
                    {t(`process.steps.${step}.title`)}
                  </h3>
                  <p className="text-steel text-sm leading-relaxed relative z-10">
                    {t(`process.steps.${step}.description`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
