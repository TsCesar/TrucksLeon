'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { locales, localeNames, localeFlags, type Locale } from '@/config/locales'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const t = useTranslations('aria')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-steel hover:text-off-white transition-colors focus-visible:ring-2 focus-visible:ring-red-accent"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('changeLanguage')}
      >
        <span>{localeFlags[locale]}</span>
        <span className="hidden sm:inline font-medium">{localeNames[locale]}</span>
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t('selectLanguage')}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-40 bg-graphite border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
          >
            {locales.map((loc) => (
              <li key={loc}>
                <button
                  role="option"
                  aria-selected={loc === locale}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors',
                    loc === locale
                      ? 'text-red-accent bg-red-accent/10'
                      : 'text-steel hover:text-off-white hover:bg-white/5'
                  )}
                >
                  <span>{localeFlags[loc]}</span>
                  <span>{localeNames[loc]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
