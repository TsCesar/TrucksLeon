import { useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'
import { EuropeRouteMap } from '@/components/animations/EuropeRouteMap'

export function EuropePreview() {
  const t = useTranslations()

  return (
    <Section dark id="europa">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal direction="left">
            <div>
              <span className="inline-flex items-center gap-2 text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
                <Globe size={12} aria-hidden />
                {t('europe.badge')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-off-white mb-6 leading-tight">
                {t('europe.title')}
              </h2>
              <p className="text-steel text-lg leading-relaxed mb-4">
                {t('europe.subtitle')}
              </p>
              <p className="text-steel leading-relaxed mb-8">
                {t('europe.description')}
              </p>
              <div className="inline-flex items-center gap-4 px-5 py-4 rounded-xl bg-graphite/60 border border-white/5">
                <span className="font-mono text-3xl font-bold text-red-accent leading-none">+15</span>
                <span className="text-sm text-steel leading-tight">{t('hero.stats.countries')}</span>
              </div>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div className="p-6 rounded-2xl bg-graphite/40 border border-white/5">
              <EuropeRouteMap />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
