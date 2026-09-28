/**
 * Permanent redirects from the previous trucksleon.com to this site.
 *
 * System A of three (see `src/middleware.ts` for the other two). These are
 * SEO migration redirects: identical for every visitor, permanent, and applied
 * by `redirects()` in `next.config.ts`, which Next evaluates before the
 * locale middleware — so each old URL reaches its destination in ONE hop and
 * never chains through `/quienes-somos` -> `/es/quienes-somos`.
 *
 * Every `from` below was verified with a live request against the old site:
 * all return 200 today. Nothing here is guessed.
 *
 * Old slugs are reproduced EXACTLY, including their mistakes. `semireolques-
 * ganaderos` is missing an "m", `semiremolques-extensibles` is missing an "r",
 * `volvo-fh12-440-hormigonera-8x4` names an FH12 for a vehicle shown as an
 * FM12, and `marcedes-1844-caja-pezzaioli` misspells Mercedes. Those strings
 * are what search engines and inbound links hold, so correcting them here
 * would simply fail to match.
 *
 * Targets are always Spanish. These URLs were the Spanish-only old site, and a
 * crawler asking for one must get the same answer every time — geo detection
 * applies to `/` alone and never to a permanent redirect.
 *
 * `permanent: true` emits 308, which preserves the method and is the modern
 * equivalent of 301 for this purpose.
 */

export type LegacyRedirect = {
  /** Path on the old site, exactly as published. */
  from: string
  /** Path on this site. Always final — never another redirect. */
  to: string
  /** Why this destination, for `docs/legacy-url-migration.md`. */
  reason: string
}

/** Top-level pages of the old site. */
export const LEGACY_PAGES: LegacyRedirect[] = [
  {
    from: '/quienes-somos',
    to: '/es/quienes-somos',
    reason: 'Same page, same content, now under the Spanish locale prefix.',
  },
  {
    from: '/servicios',
    to: '/es/servicios',
    reason: 'Same page. Present in the old sitemap but absent from its main nav.',
  },
  {
    from: '/contacto',
    to: '/es/contacto',
    reason: 'Same page.',
  },
  {
    from: '/catalogo',
    to: '/es/vehiculos-entregados',
    reason:
      'The old nav labelled /catalogo "VEHÍCULOS ENTREGADOS". It is the delivered-vehicle listing, not a for-sale catalogue.',
  },
  {
    from: '/blogs',
    to: '/es/novedades',
    reason: 'The old news index. "Novedades" is the same section renamed.',
  },
  {
    from: '/blogs/estrenamos-web',
    to: '/es/novedades',
    reason:
      'The single post announced the previous website launch, so it has no counterpart. Sent to the section that replaced it rather than to the home page.',
  },
  {
    from: '/condiciones-de-la-lopd',
    to: '/es/aviso-legal',
    reason: 'Legal notice. The old page also carried the privacy policy under #politica.',
  },
  {
    from: '/politica-de-cookies',
    to: '/es/privacidad',
    reason:
      'The new site has no separate cookie page; cookie and data handling are covered by the privacy policy.',
  },
]

/**
 * Category listings under the old catalogue.
 *
 * All eleven map onto a category that still exists on `/es/vehiculos`, but that
 * page presents the categories on one screen and has no per-category URL, so
 * the category itself is not preserved as a destination. Documented as a loss
 * of granularity rather than hidden.
 */
export const LEGACY_CATEGORIES: LegacyRedirect[] = [
  '/catalogo/cajas-tractoras',
  '/catalogo/camiones-caja-cerrada',
  '/catalogo/camiones-frigorificos',
  '/catalogo/camiones-ganaderos',
  '/catalogo/camiones-grua',
  '/catalogo/camiones-rigidos',
  '/catalogo/furgonetas',
  '/catalogo/hormigoneras',
  '/catalogo/portacoches',
  '/catalogo/semiremolques-extensibles',
  '/catalogo/semireolques-ganaderos',
].map((from) => ({
  from,
  to: '/es/vehiculos',
  reason:
    'Vehicle type listing. The same categories are presented on /es/vehiculos, which has no per-category URL.',
}))

/**
 * Individual vehicle pages.
 *
 * All twelve correspond one-to-one with a card on `/es/vehiculos-entregados`,
 * each with its real photographs. The new site has no per-vehicle URL, so the
 * individual page is lost while the vehicle itself is not — which is why these
 * go to the listing and not to the home page.
 */
export const LEGACY_VEHICLES: LegacyRedirect[] = [
  ['/catalogo/volvo-fh12-440-hormigonera-8x4', 'VOLVO FM12 440 HORMIGONERA 8X4 (old slug says FH12)'],
  ['/catalogo/scania-g400', 'SCANIA G400 CAJA CERRADA'],
  ['/catalogo/iveco-stralis-500-6x2-euro-5', 'IVECO STRALIS 500 6X2 EURO 5'],
  ['/catalogo/marcedes-1844-caja-pezzaioli', 'MERCEDES 1844 CAJA PEZZAIOLI (old slug says "marcedes")'],
  ['/catalogo/mb-2550', 'MB 2550 V8'],
  ['/catalogo/daf-xf-510-retarder-superspace-cab', 'DAF XF 510 RETARDER SUPERSPACE CAB'],
  ['/catalogo/daf-xf-460-retarder', 'DAF XF 460 RETARDER'],
  ['/catalogo/volvo-2013-fh13-540', 'VOLVO FH13 540'],
  ['/catalogo/daf-460-special-edition', 'DAF 460 SPECIAL EDITION'],
  ['/catalogo/pezzaioli-sba31u', 'PEZZAIOLI SBA31U'],
  ['/catalogo/dtec', 'D-TEC'],
  ['/catalogo/mercedes-antos-porta-coches', 'MERCEDES ANTOS PORTA COCHES'],
].map(([from, vehicle]) => ({
  from,
  to: '/es/vehiculos-entregados',
  reason: `Individual page for ${vehicle}. Present on the new listing as a card with its gallery; no per-vehicle URL exists.`,
}))

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  ...LEGACY_PAGES,
  ...LEGACY_CATEGORIES,
  ...LEGACY_VEHICLES,
]
