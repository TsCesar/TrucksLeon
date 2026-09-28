'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { locales, localeNames, type Locale } from '@/config/locales'
import { LOCALE_COOKIE, localeCookieAttributes } from '@/lib/geo'
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

  /**
   * Remember the choice so `/` honours it on the next visit.
   *
   * Written from the client rather than by the server: this is a plain
   * client-side navigation, there is no request to attach a Set-Cookie to.
   * Only the locale is stored — never a country, never anything identifying.
   * `Secure` is added on HTTPS only, so it still works on http://localhost.
   */
  function rememberLocale(newLocale: Locale) {
    if (typeof document === 'undefined') return
    const isSecure = window.location.protocol === 'https:'
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; ${localeCookieAttributes(isSecure)}`
  }

  function switchLocale(newLocale: Locale) {
    if (newLocale === activeLocale) { setOpen(false); return }
    rememberLocale(newLocale)
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
        /* WCAG 2.5.3 Label in Name: the accessible name has to contain the
           visible text. A bare "Cambiar idioma" replaced "ES Español" outright,
           so anyone using voice control could not say what they could see. */
        aria-label={`${activeLocale.toUpperCase()} ${localeNames[activeLocale]} — ${t('changeLanguage')}`}
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
                    {/* No flag glyph: Windows ships no regional-indicator
                        emoji, so every flag falls back to its two letters and
                        the row read "GB EN English" / "ES ES Español". The
                        code badge alone is unambiguous in every locale. */}
                    <span
                      className={cn(
                        'font-mono text-[11px] font-bold tracking-wide flex-shrink-0 rounded px-1.5 py-0.5 border',
                        isActive
                          ? 'text-red-text border-red-accent/30 bg-red-accent/[0.06]'
                          : 'text-ink border-line/10 bg-line/[0.05]'
                      )}
                    >
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
