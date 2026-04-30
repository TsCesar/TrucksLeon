import { useTranslations } from 'next-intl'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'

const steps = ['contact', 'search', 'management', 'delivery'] as const

export function ProcessPreview() {
  const t = useTranslations()

  return (
    <Section id="proceso">
      <Container>
        <SectionHeader
          badge={t('nav.process')}
          title={t('process.title')}
          subtitle={t('process.subtitle')}
        />
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-[2.25rem] left-[calc(12.5%+1.125rem)] right-[calc(12.5%+1.125rem)] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step} direction="up" delay={i * 0.12}>
                <div className="relative p-6 rounded-xl bg-graphite border border-white/5 h-full overflow-hidden">
                  {/* Large ghost number */}
                  <span
                    className="absolute -bottom-3 -right-1 font-mono font-bold text-off-white/[0.04] leading-none select-none pointer-events-none"
                    style={{ fontSize: '6rem' }}
                    aria-hidden
                  >
                    {t(`process.steps.${step}.number`)}
                  </span>
                  {/* Circle step indicator */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full border border-red-accent/60 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-xs font-bold text-red-accent leading-none">
                        {t(`process.steps.${step}.number`)}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-accent/40 to-transparent" aria-hidden />
                  </div>
                  <h3 className="font-heading font-bold text-off-white mb-3 relative z-10">
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
