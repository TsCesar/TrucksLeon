import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/forms/ContactForm'
import { Reveal } from '@/components/animations/Reveal'
import { siteConfig } from '@/config/site'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return buildMetadata({ title: t('title'), locale, path: '/contacto' })
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const contactItems = [
    { icon: Phone, label: t('contact.phone'), value: siteConfig.contact.phoneDisplay, href: `tel:${siteConfig.contact.phone}` },
    { icon: Mail, label: t('contact.email'), value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: MapPin, label: t('contact.address'), value: `${siteConfig.contact.address}, ${siteConfig.contact.postalCode} ${siteConfig.contact.city}`, href: undefined },
    { icon: Clock, label: t('contact.hours'), value: siteConfig.contact.hours, href: undefined },
  ]

  return (
    <div className="pt-20 min-h-screen bg-carbon">
      {/* Hero */}
      <div className="relative py-20 md:py-28 bg-gradient-to-b from-graphite to-carbon border-b border-white/8">
        <div className="absolute inset-0 opacity-5" aria-hidden>
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(248,250,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>
        <Container narrow>
          <Reveal>
            <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              {t('nav.contact')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-off-white mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-steel text-lg max-w-xl">
              {t('contact.description')}
            </p>
          </Reveal>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Contact info */}
          <Reveal direction="left">
            <div>
              <h2 className="text-2xl font-heading font-bold text-off-white mb-8">
                {t('contact.subtitle')}
              </h2>
              <ul className="space-y-6 mb-10">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-red-accent" aria-hidden />
                    </div>
                    <div>
                      <p className="text-xs text-steel uppercase tracking-wider font-mono mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="text-off-white hover:text-red-accent transition-colors font-medium">
                          {value}
                        </a>
                      ) : (
                        <p className="text-off-white font-medium">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* WhatsApp CTA */}
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors font-medium"
              >
                <MessageCircle size={20} aria-hidden />
                {t('contact.whatsapp')}
              </a>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal direction="right" delay={0.15}>
            <div className="p-8 rounded-2xl bg-graphite border border-white/8">
              <h2 className="text-xl font-heading font-bold text-off-white mb-6">{t('contact.form.title')}</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  )
}
