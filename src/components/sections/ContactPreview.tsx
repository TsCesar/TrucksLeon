import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Phone, Mail, ArrowRight } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { siteConfig } from '@/config/site'

export function ContactPreview() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <Section id="contacto-preview">
      <Container narrow>
        <Reveal>
          <div className="text-center p-10 md:p-16 rounded-2xl bg-gradient-to-br from-graphite to-carbon border border-white/8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-red-accent/5 via-transparent to-transparent" aria-hidden />
            <div className="relative z-10">
              <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
                24/7
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-off-white mb-4">
                {t('trust.availability.title')}
              </h2>
              <p className="text-steel text-lg mb-8 max-w-lg mx-auto">
                {t('trust.availability.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href={`/${locale}/contacto`}>
                  <Button size="lg" className="group w-full sm:w-auto">
                    {t('nav.contactCta')}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Button>
                </Link>
                <a href={`tel:${siteConfig.contact.phone}`}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <Phone size={18} aria-hidden />
                    {siteConfig.contact.phoneDisplay}
                  </Button>
                </a>
              </div>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-2 text-steel hover:text-off-white text-sm transition-colors"
              >
                <Mail size={14} aria-hidden />
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
