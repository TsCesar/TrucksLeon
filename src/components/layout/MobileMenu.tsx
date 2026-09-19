'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { navItems } from '@/config/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  locale: string
}

export function MobileMenu({ open, onClose, locale }: MobileMenuProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/25 backdrop-blur-[3px] z-40"
            onClick={onClose}
            aria-hidden
          />
          <motion.nav
            initial={prefersReducedMotion ? {} : { x: '100%' }}
            animate={{ x: 0 }}
            exit={prefersReducedMotion ? {} : { x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-surface border-l border-line/10 shadow-float z-50 flex flex-col"
            aria-label={t('aria.mobileMenuNav')}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-line/[0.08]">
              <span className="font-heading font-bold text-ink">{t('aria.mobileMenuTitle')}</span>
              <button
                onClick={onClose}
                className="p-2.5 -mr-1 rounded-lg text-steel hover:text-ink hover:bg-line/[0.05] transition-colors"
                aria-label={t('aria.closeMenu')}
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto py-3">
              {navItems.map((item, i) => {
                const href = `/${locale}${item.href === '/' ? '' : item.href}`
                const isActive = pathname === href || (item.href !== '/' && pathname.startsWith(href))
                return (
                  <motion.li
                    key={item.href}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center px-6 py-4 text-base font-medium transition-colors border-l-[3px]',
                        isActive
                          ? 'text-red-text border-red-accent bg-red-accent/[0.05]'
                          : 'text-steel border-transparent hover:text-ink hover:bg-line/[0.035] hover:border-line/15'
                      )}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>

            <div className="p-6 border-t border-line/[0.08] bg-canvas">
              <Link href={`/${locale}/contacto`} onClick={onClose}>
                <Button className="w-full">{t('nav.contactCta')}</Button>
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
