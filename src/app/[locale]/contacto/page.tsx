import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/forms/ContactForm'
import { Reveal } from '@/components/animations/Reveal'
import { siteConfig } from '@/config/site'
import { buildMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({ locale, page: 'contact' })
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  const contactItems = [
    { icon: Phone, label: t('contact.phone'), value: siteConfig.contact.phoneDisplay, href: `tel:${siteConfig.contact.phone}` },
    { icon: Mail, label: t('contact.email'), value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: MapPin, label: t('contact.address'), value: `${siteConfig.contact.address}, ${siteConfig.contact.postalCode} ${siteConfig.contact.city}`, href: undefined },
    { icon: Clock, label: t('contact.hours'), value: t('contact.hoursValue'), href: undefined },
  ]

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-canvas">
      <JsonLd locale={locale} page="contact" />
      {/* Hero */}
      <div className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-surface via-surface to-canvas border-b border-line/[0.07]">
        <div className="absolute inset-0 tech-grid opacity-70" aria-hidden />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 500px 320px at 6% 0%, rgb(215 25 32 / 0.075) 0%, rgb(215 25 32 / 0.03) 45%, transparent 75%)',
          }}
          aria-hidden
        />
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-accent/70 to-transparent" aria-hidden />
        {/* LCP block — CSS entry, never gated on hydration (see PageHero).
            Full-width Container, not `narrow`: the narrow variant centres at
            max-w-4xl, which indented the whole hero ~270px to the right of the
            two-column grid below it on desktop. */}
        <Container className="relative">
          <span className="hero-rise inline-flex items-center gap-2 text-red-text font-mono text-xs font-semibold tracking-[0.18em] uppercase mb-4">
            <span className="w-5 h-px bg-red-accent/60" aria-hidden />
            {t('nav.contact')}
          </span>
          <h1 className="hero-rise hero-rise-1 text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-ink mb-4 tracking-tight text-balance">
            {t('contact.title')}
          </h1>
          <p className="hero-rise hero-rise-2 text-steel text-lg max-w-xl">
            {t('contact.description')}
          </p>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-16 md:py-24">
        {/* items-stretch + h-full down both branches: the information column
            used to finish roughly 280px above the form on desktop. Nothing is
            padded out — the four channels simply share the column's full
            height and the WhatsApp CTA is pinned to the bottom edge, so both
            columns start and end on the same lines. */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

          {/* Contact info */}
          <Reveal direction="left" className="h-full">
            <div className="flex h-full flex-col">
              <h2 className="text-2xl font-heading font-bold text-ink mb-8 tracking-tight">
                {t('contact.subtitle')}
              </h2>
              <ul className="flex flex-1 flex-col justify-between gap-4">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <li
                    key={label}
                    className="flex items-center gap-4 rounded-xl border border-line/[0.09] bg-surface p-4 shadow-card transition-colors duration-300 hover:border-red-accent/25"
                  >
                    <div className="w-11 h-11 rounded-lg bg-red-accent/[0.08] ring-1 ring-red-accent/12 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-red-accent" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-steel uppercase tracking-wider font-mono mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="inline-flex items-center min-h-[26px] text-ink hover:text-red-text transition-colors font-medium break-words">
                          {value}
                        </a>
                      ) : (
                        <p className="text-ink font-medium">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* WhatsApp CTA — sits on the form's bottom edge */}
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#25D366]/[0.08] border border-[#25D366]/35 text-[#0B6B38] shadow-card hover:bg-[#25D366]/[0.14] hover:border-[#25D366]/55 hover:-translate-y-0.5 hover:shadow-lift transition-all duration-300 font-semibold"
              >
                <MessageCircle size={20} aria-hidden />
                {t('contact.whatsapp')}
              </a>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal direction="right" delay={0.15} className="h-full">
            <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-surface border border-line/[0.09] shadow-float overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent to-transparent" aria-hidden />
              <h2 className="text-xl font-heading font-bold text-ink mb-6 tracking-tight">{t('contact.form.title')}</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  )
}
