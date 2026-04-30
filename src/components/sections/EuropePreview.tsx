import { useTranslations } from 'next-intl'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'
import { europeanCountries } from '@/data/countries'

export function EuropePreview() {
  const t = useTranslations()

  return (
    <Section dark id="europa">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal direction="left">
            <div>
              <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
                Europa
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-off-white mb-6 leading-tight">
                {t('europe.title')}
              </h2>
              <p className="text-steel text-lg leading-relaxed mb-6">
                {t('europe.subtitle')}
              </p>
              <p className="text-steel leading-relaxed">
                {t('europe.description')}
              </p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {europeanCountries.map((country) => (
                <div
                  key={country.code}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-graphite border border-white/5 hover:border-white/15 transition-colors"
                >
                  <span className="text-2xl" role="img" aria-label={country.name}>{country.flag}</span>
                  <span className="text-xs text-steel text-center leading-tight">{country.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
