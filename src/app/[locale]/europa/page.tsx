import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'
import { EuropePreview } from '@/components/sections/EuropePreview'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'europe' })
  return buildMetadata({ title: t('title'), locale, path: '/europa' })
}

export default async function EuropaPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return (
    <div className="pt-20 min-h-screen bg-carbon">
      <div className="py-20 md:py-28 bg-graphite border-b border-white/8">
        <Container>
          <Reveal>
            <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">{t('nav.europe')}</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-off-white mb-6">{t('europe.title')}</h1>
            <p className="text-steel text-xl max-w-2xl">{t('europe.subtitle')}</p>
          </Reveal>
        </Container>
      </div>
      <EuropePreview />
    </div>
  )
}
