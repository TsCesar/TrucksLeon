import Link from 'next/link'
import { Image } from '@/components/ui/Image'
import { useTranslations, useLocale } from 'next-intl'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { navItems } from '@/config/navigation'

export function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-mist border-t border-line/[0.08] overflow-hidden">
      {/* Red rule across the top — the same accent that opens the header */}
      <div className="h-px bg-gradient-to-r from-transparent via-red-accent to-transparent" aria-hidden />
      <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none" aria-hidden />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-block mb-6">
              <Image
                src="/images/brand/logo-trucksleon.png"
                alt={t('aria.logoAlt')}
                width={180}
                height={54}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-steel text-sm leading-relaxed max-w-xs mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-surface border border-line/10 text-steel shadow-card hover:text-red-text hover:border-red-accent/30 hover:-translate-y-0.5 hover:shadow-lift transition-all duration-300"
                aria-label={t('aria.facebook')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-surface border border-line/10 text-steel shadow-card hover:text-[#1DA851] hover:border-[#25D366]/40 hover:-translate-y-0.5 hover:shadow-lift transition-all duration-300"
                aria-label={t('aria.whatsapp')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-ink font-heading font-semibold text-sm uppercase tracking-wider mb-5">
              {t('footer.links')}
            </h3>
            <ul className="space-y-1">
              {navItems.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href === '/' ? '' : item.href}`}
                    className="inline-flex items-center py-1.5 min-h-[28px] text-steel hover:text-red-text text-sm transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-ink font-heading font-semibold text-sm uppercase tracking-wider mb-5">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-start gap-3 py-0.5 text-steel hover:text-red-text text-sm transition-colors group"
                >
                  <Phone size={15} className="mt-0.5 flex-shrink-0 text-red-accent/70 group-hover:text-red-accent transition-colors" aria-hidden />
                  <span className="font-mono">{siteConfig.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-start gap-3 py-0.5 text-steel hover:text-red-text text-sm transition-colors group break-all"
                >
                  <Mail size={15} className="mt-0.5 flex-shrink-0 text-red-accent/70 group-hover:text-red-accent transition-colors" aria-hidden />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-steel text-sm">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-red-accent/70" aria-hidden />
                  <span>{siteConfig.contact.address}, {siteConfig.contact.city}</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-steel text-sm">
                  <Clock size={15} className="mt-0.5 flex-shrink-0 text-red-accent/70" aria-hidden />
                  <span>{siteConfig.contact.hours}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-line/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-steel text-xs text-center sm:text-left">
            © {year} {siteConfig.legalName}. {t('footer.copyright')}
          </p>
          <div className="flex gap-5">
            <Link href={`/${locale}/privacidad`} className="inline-flex items-center min-h-[28px] text-steel hover:text-red-text text-xs transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href={`/${locale}/aviso-legal`} className="inline-flex items-center min-h-[28px] text-steel hover:text-red-text text-xs transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
