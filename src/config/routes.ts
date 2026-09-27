/**
 * The public page table.
 *
 * One row per indexable page: the URL path (without the locale prefix) and the
 * key of its entry in the `seo` message namespace. Metadata, hreflang and the
 * sitemap all iterate this, so a new page is added in exactly one place and
 * cannot end up in the sitemap without a title, or vice versa.
 *
 * Paths are the Spanish slugs, which are the real routes in `src/app/[locale]`
 * for every language.
 */
export const pages = {
  home: '',
  about: '/quienes-somos',
  services: '/servicios',
  vehicles: '/vehiculos',
  delivered: '/vehiculos-entregados',
  process: '/proceso',
  europe: '/europa',
  news: '/novedades',
  contact: '/contacto',
  privacy: '/privacidad',
  legal: '/aviso-legal',
} as const

export type PageKey = keyof typeof pages

/** Every page key, in the order they should appear in the sitemap. */
export const pageKeys = Object.keys(pages) as PageKey[]
