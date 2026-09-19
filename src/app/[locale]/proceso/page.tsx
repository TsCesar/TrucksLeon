import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { ProcessPreview } from '@/components/sections/ProcessPreview'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'process' })
  return buildMetadata({ title: t('title'), locale, path: '/proceso' })
}

export default async function ProcesoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <PageHero
        badge={t('process.pageBadge')}
        title={t('process.title')}
        subtitle={t('process.subtitle')}
      />

      {/* Overview banner */}
      <section className="py-10 bg-surface border-b border-line/[0.07]">
        <Container>
          <Reveal>
            <p className="text-steel text-lg leading-relaxed max-w-2xl text-center mx-auto">
              {t('process.overview')}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Process steps — no header since page already has one */}
      <ProcessPreview showHeader={false} />

      {/* CTA */}
      <section className="py-16 md:py-20 bg-surface border-t border-line/[0.07]">
        <Container narrow>
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 tracking-tight">
                {t('trust.availability.title')}
              </h2>
              <p className="text-steel mb-8 max-w-md mx-auto leading-relaxed">
                {t('trust.availability.description')}
              </p>
              <Link href={`/${locale}/contacto`}>
                <Button size="lg" className="group">
                  {t('nav.contactCta')}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
