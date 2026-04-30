import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en', 'nl', 'de', 'fr'],
  defaultLocale: 'es',
})
