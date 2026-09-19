'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Image } from '@/components/ui/Image'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu } from 'lucide-react'
import { motion } from 'motion/react'
import { navItems } from '@/config/navigation'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { cn } from '@/lib/utils'

export function Header() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-[background-color,box-shadow,border-color] duration-300',
          'bg-surface/80 backdrop-blur-xl backdrop-saturate-150 border-b',
          scrolled
            ? 'border-line/10 shadow-header'
            : 'border-transparent'
        )}
      >
        {/* Hairline of brand red that fades in with scroll */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-accent/45 to-transparent transition-opacity duration-300',
            scrolled ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-3">
            {/* Logo — dark lettering reads directly on the white header */}
            <Link
              href={`/${locale}`}
              className="group flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
              aria-label={t('aria.logoLink')}
            >
              <Image
                src="/images/brand/logo-trucksleon.png"
                alt={t('aria.logoAlt')}
                width={180}
                height={54}
                className="h-12 lg:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label={t('aria.mainNav')}>
              {navItems.slice(0, -1).map((item) => {
                const href = `/${locale}${item.href === '/' ? '' : item.href}`
                const isActive = pathname === href || (item.href !== '/' && pathname.startsWith(href))
                return (
                  <Link
                    key={item.href}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200',
                      isActive
                        ? 'text-red-text'
                        : 'text-steel hover:text-ink hover:bg-line/[0.035]'
                    )}
                  >
                    {t(item.labelKey)}
                    <span
                      className={cn(
                        'absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-red-accent origin-center transition-transform duration-300 ease-out-expo',
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      )}
                      aria-hidden
                    />
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <Link href={`/${locale}/contacto`} className="hidden lg:block">
                <Button size="sm">{t('nav.contactCta')}</Button>
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 -mr-1 rounded-lg text-steel hover:text-ink hover:bg-line/[0.05] transition-colors"
                aria-label={t('aria.openMenu')}
                aria-expanded={mobileOpen}
              >
                <Menu size={22} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} locale={locale} />
    </>
  )
}
