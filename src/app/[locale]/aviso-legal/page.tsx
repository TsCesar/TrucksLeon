import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return buildMetadata({ title: t('title'), locale, path: '/aviso-legal' })
}

export default async function AvisoLegalPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <div className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-surface via-surface to-canvas border-b border-line/[0.07]">
        <div className="absolute inset-0 tech-grid opacity-70" aria-hidden />
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-accent/70 to-transparent" aria-hidden />
        <Container className="relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-red-text font-mono text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              <span className="w-5 h-px bg-red-accent/60" aria-hidden />
              {t('legal.badge')}
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-ink mb-6 tracking-tight text-balance">
              {t('legal.title')}
            </h1>
          </Reveal>
        </Container>
      </div>
      <Container className="py-16 md:py-24">
        <Reveal>
          <p className="text-steel text-lg leading-relaxed max-w-3xl">
            {t('legal.placeholder')}
          </p>
        </Reveal>
      </Container>
    </div>
  )
}
