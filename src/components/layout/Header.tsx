'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
          scrolled
            ? 'bg-carbon/95 backdrop-blur-md border-b border-white/8 shadow-2xl'
            : 'bg-gradient-to-b from-black/60 to-transparent'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-red-accent rounded-lg"
              aria-label={t('aria.logoLink')}
            >
              <Image
                src="/images/brand/logo-trucksleon.png"
                alt="TrucksLeón International"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label={t('aria.mainNav')}>
              {navItems.slice(0, -1).map((item) => {
                const href = `/${locale}${item.href === '/' ? '' : item.href}`
                const isActive = pathname === href || (item.href !== '/' && pathname.startsWith(href))
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-red-accent'
                        : 'text-steel hover:text-off-white'
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link href={`/${locale}/contacto`} className="hidden lg:block">
                <Button size="sm">{t('nav.contactCta')}</Button>
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg text-steel hover:text-off-white hover:bg-white/5 transition-colors"
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
