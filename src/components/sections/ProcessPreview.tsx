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
          badge="Proceso"
          title={t('process.title')}
          subtitle={t('process.subtitle')}
        />
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step} direction="up" delay={i * 0.12}>
                <div className="relative p-6 rounded-xl bg-graphite border border-white/5 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-3xl font-bold text-red-accent/30 leading-none">
                      {t(`process.steps.${step}.number`)}
                    </span>
                    <div className="w-6 h-px bg-red-accent/40" aria-hidden />
                  </div>
                  <h3 className="font-heading font-bold text-off-white mb-3">
                    {t(`process.steps.${step}.title`)}
                  </h3>
                  <p className="text-steel text-sm leading-relaxed">
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
