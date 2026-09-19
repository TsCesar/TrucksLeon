'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
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

  // Derive active locale from URL path — updates immediately on client navigation
  // before NextIntlClientProvider re-renders with the new locale value
  const pathSegment = pathname.split('/')[1]
  const activeLocale: Locale = locales.includes(pathSegment as Locale) ? (pathSegment as Locale) : locale

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
    if (newLocale === activeLocale) { setOpen(false); return }
    const segments = pathname.split('/')
    // segments[0] is always '' (before leading slash)
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale
    } else if (segments[1] === '') {
      segments.splice(1, 0, newLocale)
    } else {
      segments.splice(1, 0, newLocale)
    }
    const newPath = segments.join('/') || '/'
    const query = typeof window !== 'undefined' ? window.location.search : ''
    // Do NOT call router.refresh() here — it races against router.push() and
    // re-fetches the old locale's RSC payload before the navigation resolves,
    // causing the header to stay in the previous language.
    router.push(newPath + query)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm min-h-[38px] text-steel hover:text-ink hover:bg-line/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-accent"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('changeLanguage')}
      >
        {/* Code badge */}
        <span className="font-mono text-[11px] font-bold tracking-widest text-ink bg-line/[0.06] border border-line/10 px-1.5 py-0.5 rounded">
          {activeLocale.toUpperCase()}
        </span>
        {/* Full name — hidden on small screens */}
        <span className="hidden sm:block text-xs leading-none">
          {localeNames[activeLocale]}
        </span>
        <ChevronDown
          size={12}
          className={cn('transition-transform duration-200 text-steel/70 flex-shrink-0', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t('selectLanguage')}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl overflow-hidden border border-line/10 shadow-float z-50"
          >
            {locales.map((loc) => {
              const isActive = loc === activeLocale
              return (
                <li key={loc}>
                  <button
                    role="option"
                    aria-selected={isActive}
                    onClick={() => switchLocale(loc)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-2',
                      isActive
                        ? 'text-red-text bg-red-accent/[0.06] border-red-accent'
                        : 'text-steel border-transparent hover:text-ink hover:bg-line/[0.04]'
                    )}
                  >
                    <span className="text-base leading-none flex-shrink-0" aria-hidden>
                      {localeFlags[loc]}
                    </span>
                    <span className="font-mono text-[11px] font-bold tracking-wide flex-shrink-0">
                      {loc.toUpperCase()}
                    </span>
                    <span className="text-xs flex-1 text-left">{localeNames[loc]}</span>
                    {isActive && (
                      <Check size={12} className="text-red-accent flex-shrink-0" aria-hidden />
                    )}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
