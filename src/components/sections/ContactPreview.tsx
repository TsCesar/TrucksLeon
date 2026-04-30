import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Phone, MessageCircle, Mail, ArrowRight } from 'lucide-react'
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
            {/* Dramatic red glow */}
            <div className="absolute inset-0 bg-gradient-radial from-red-accent/8 via-transparent to-transparent" aria-hidden />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-accent/8 rounded-full blur-[80px] pointer-events-none" aria-hidden />

            <div className="relative z-10">
              <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
                24/7
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-off-white mb-4">
                {t('trust.availability.title')}
              </h2>
              <p className="text-steel text-lg mb-10 max-w-lg mx-auto">
                {t('trust.availability.description')}
              </p>

              {/* 3-column contact methods */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.04] border border-white/8 hover:border-red-accent/30 hover:bg-red-accent/5 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-red-accent/10 flex items-center justify-center group-hover:bg-red-accent/20 transition-colors">
                    <Phone size={18} className="text-red-accent" aria-hidden />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-steel uppercase tracking-wider mb-1">{t('contact.phone')}</div>
                    <div className="text-sm font-mono text-off-white">{siteConfig.contact.phoneDisplay}</div>
                  </div>
                </a>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.04] border border-white/8 hover:border-red-accent/30 hover:bg-red-accent/5 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-red-accent/10 flex items-center justify-center group-hover:bg-red-accent/20 transition-colors">
                    <MessageCircle size={18} className="text-red-accent" aria-hidden />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-steel uppercase tracking-wider mb-1">{t('contact.whatsapp')}</div>
                    <div className="text-sm font-mono text-off-white">{siteConfig.contact.phoneDisplay}</div>
                  </div>
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.04] border border-white/8 hover:border-red-accent/30 hover:bg-red-accent/5 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-red-accent/10 flex items-center justify-center group-hover:bg-red-accent/20 transition-colors">
                    <Mail size={18} className="text-red-accent" aria-hidden />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-steel uppercase tracking-wider mb-1">{t('contact.email')}</div>
                    <div className="text-sm font-mono text-off-white break-all">{siteConfig.contact.email}</div>
                  </div>
                </a>
              </div>

              <Link href={`/${locale}/contacto`}>
                <Button size="lg" className="group">
                  {t('nav.contactCta')}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
