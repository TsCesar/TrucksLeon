import { useTranslations } from 'next-intl'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'
import { ProcessConnector } from '@/components/animations/ProcessConnector'

const steps = ['contact', 'search', 'management', 'delivery'] as const

type Props = { showHeader?: boolean }

export function ProcessPreview({ showHeader = true }: Props) {
  const t = useTranslations()

  return (
    <Section id="proceso">
      <Container>
        {showHeader && (
          <SectionHeader
            badge={t('nav.process')}
            title={t('process.title')}
            subtitle={t('process.subtitle')}
          />
        )}
        <div className="relative">
          <ProcessConnector />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step} direction="up" delay={i * 0.12}>
                <div className="group relative p-6 rounded-xl bg-graphite border border-white/5 h-full overflow-hidden hover:-translate-y-1 hover:border-red-accent/20 hover:shadow-[0_8px_32px_rgba(215,25,32,0.08)] transition-all duration-300">
                  <span
                    className="absolute -bottom-3 -right-1 font-mono font-bold text-off-white/[0.04] leading-none select-none pointer-events-none"
                    style={{ fontSize: '6rem' }}
                    aria-hidden
                  >
                    {t(`process.steps.${step}.number`)}
                  </span>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full border border-red-accent/60 flex items-center justify-center flex-shrink-0 group-hover:border-red-accent group-hover:bg-red-accent/10 transition-colors">
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
