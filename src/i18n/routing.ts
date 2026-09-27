import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from '@/config/locales'

/**
 * Single source of truth for locale routing.
 *
 * The locale list lives in `src/config/locales.ts` (it is also used by the
 * language switcher, `generateStaticParams` and the sitemap). This file used to
 * repeat the array literally, so the two could drift apart.
 */
export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
})
