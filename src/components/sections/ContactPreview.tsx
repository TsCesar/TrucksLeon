'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Phone, MessageCircle, Mail, ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/animations/Reveal'
import { siteConfig } from '@/config/site'

export function ContactPreview() {
  const t = useTranslations()
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()

  const channels = [
    {
      href: `tel:${siteConfig.contact.phone}`,
      icon: Phone,
      labelKey: 'contact.phone' as const,
      value: siteConfig.contact.phoneDisplay,
    },
    {
      href: siteConfig.social.whatsapp,
      icon: MessageCircle,
      labelKey: 'contact.whatsapp' as const,
      value: siteConfig.contact.phoneDisplay,
      external: true,
    },
    {
      href: `mailto:${siteConfig.contact.email}`,
      icon: Mail,
      labelKey: 'contact.email' as const,
      value: siteConfig.contact.email,
    },
  ]

  return (
    <Section tone="mist" id="contacto-preview">
      <Container narrow>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line/[0.09] bg-surface shadow-float">
            {/* Layered light ground */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-canvas" aria-hidden />
            <div className="absolute inset-0 tech-grid opacity-70" aria-hidden />

            {/* Slow red blooms — warmth, not colour blocking */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-red-accent/[0.07] blur-[110px] pointer-events-none"
                  animate={{ x: [0, 30, 0], y: [0, -18, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden
                />
                <motion.div
                  className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-red-accent/[0.06] blur-[130px] pointer-events-none"
                  animate={{ x: [0, -30, 0], y: [0, 18, 0] }}
                  transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  aria-hidden
                />
              </>
            )}

            {/* Red rule on top */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent to-transparent"
              aria-hidden
            />

            <div className="relative z-10 text-center p-8 sm:p-10 md:p-16">
              <motion.span
                className="inline-block text-red-text font-mono text-xs font-semibold tracking-widest uppercase mb-4"
                initial={prefersReducedMotion ? {} : { opacity: 0, letterSpacing: '0.05em' }}
                whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                24/7
              </motion.span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-ink mb-4 leading-tight tracking-tight text-balance">
                {t('trust.availability.title')}
              </h2>
              <p className="text-steel text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                {t('trust.availability.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {channels.map(({ href, icon: Icon, labelKey, value, external }) => (
                  <a
                    key={labelKey}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/35 hover:-translate-y-1.5 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_18px_36px_-20px_rgb(215_25_32_/_0.32)] transition-all duration-300 ease-out-expo"
                  >
                    <div className="w-11 h-11 rounded-full bg-red-accent/[0.08] ring-1 ring-red-accent/12 flex items-center justify-center group-hover:bg-red-accent/[0.15] group-hover:ring-red-accent/28 group-hover:scale-110 transition-all duration-300">
                      <Icon size={18} className="text-red-accent" aria-hidden />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-steel uppercase tracking-wider mb-1">{t(labelKey)}</div>
                      <div className="text-sm font-mono text-ink group-hover:text-red-text transition-colors break-all">
                        {value}
                      </div>
                    </div>
                  </a>
                ))}
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
