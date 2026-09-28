import { locales, type Locale } from '@/config/locales'

/**
 * Language resolution for the bare root URL.
 *
 * Kept out of the middleware on purpose: this is policy, it needs to be
 * testable on its own, and the same rules are quoted in
 * `docs/deployment-geoip.md`. The middleware only wires it to a request.
 *
 * Nothing here reads or retains an IP address. The hosting platform resolves
 * the country before the request arrives and hands over a two-letter code; that
 * code picks a URL and is then discarded. No third-party lookup, no geolocation
 * API, no logging.
 */

/** Cookie holding a language the visitor chose by hand. */
export const LOCALE_COOKIE = 'trucksleon_locale'

/** One year. Long enough to be remembered, short enough to expire. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * Name of the request header carrying the visitor's country, or null when no
 * such header has been declared.
 *
 * Deliberately a SERVER-side variable and deliberately a single name:
 *
 *   GEO_COUNTRY_HEADER=cf-ipcountry        (Cloudflare)
 *   GEO_COUNTRY_HEADER=x-vercel-ip-country (Vercel)
 *   GEO_COUNTRY_HEADER=x-geoip-country     (…whatever the host documents)
 *
 * A request header is only trustworthy if something in front of the app
 * overwrites it on every request. Scanning a list of plausible names
 * (`x-country`, `country`, …) would let any client pick its own language by
 * sending one, so exactly one header is read and only when the operator has
 * named it. Unset means no geo detection at all, which is a supported mode —
 * see `resolveRootLocale`.
 */
export function geoCountryHeaderName(): string | null {
  const name = process.env.GEO_COUNTRY_HEADER?.trim().toLowerCase()
  return name ? name : null
}

/**
 * Country -> language. Explicit and closed.
 *
 * Only countries whose language this site publishes are listed, plus Austria,
 * mapped to German by agreement. Multilingual countries are deliberately
 * absent: Belgium is not guessed as French or Dutch, Switzerland is not guessed
 * as German or French. Guessing wrong in a country with a language politics
 * problem is worse than showing English.
 */
export const COUNTRY_LOCALE: Record<string, Locale> = {
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  NL: 'nl',
  AT: 'de',
}

/**
 * Where everyone else goes: no country, an unrecognised country, a malformed
 * header, or no geo header configured at all. English is the international
 * edition, which is also why hreflang declares it as x-default.
 */
export const FALLBACK_LOCALE: Locale = 'en'

/** ISO-3166-1 alpha-2, or null if the value is absent or not a country code. */
export function normalizeCountry(raw: string | null | undefined): string | null {
  if (!raw) return null
  const code = raw.trim().toUpperCase()
  return /^[A-Z]{2}$/.test(code) ? code : null
}

/** A country code (however malformed) mapped to a language. Never throws. */
export function localeFromCountry(raw: string | null | undefined): Locale {
  const code = normalizeCountry(raw)
  if (!code) return FALLBACK_LOCALE
  return COUNTRY_LOCALE[code] ?? FALLBACK_LOCALE
}

/**
 * A cookie value turned into a locale, or null.
 *
 * The cookie is attacker-controlled, so only the five known values are
 * accepted; anything else is treated as absent and the visitor falls through
 * to geo detection.
 */
export function parseLocaleCookie(raw: string | null | undefined): Locale | null {
  if (!raw) return null
  const value = raw.trim().toLowerCase()
  return (locales as readonly string[]).includes(value) ? (value as Locale) : null
}

export type RootResolution = {
  locale: Locale
  /** Which rule decided. Used by the tests and the debug response header. */
  source: 'cookie' | 'geo' | 'fallback'
}

/**
 * The order is fixed: a choice the visitor made themselves outranks anything
 * inferred about where they are, and anything unknown resolves to English.
 *
 * Geo detection is an enhancement, never a dependency. With no country header
 * configured — or none present — this still returns a valid locale, so the
 * site behaves correctly on a host that offers no geo signal whatsoever.
 */
export function resolveRootLocale(input: {
  cookie?: string | null
  country?: string | null
}): RootResolution {
  const chosen = parseLocaleCookie(input.cookie)
  if (chosen) return { locale: chosen, source: 'cookie' }

  const code = normalizeCountry(input.country)
  if (code && COUNTRY_LOCALE[code]) {
    return { locale: COUNTRY_LOCALE[code], source: 'geo' }
  }

  return { locale: FALLBACK_LOCALE, source: 'fallback' }
}

/** Attributes for the cookie written when someone picks a language. */
export function localeCookieAttributes(isSecure: boolean): string {
  return [
    'Path=/',
    `Max-Age=${LOCALE_COOKIE_MAX_AGE}`,
    'SameSite=Lax',
    ...(isSecure ? ['Secure'] : []),
  ].join('; ')
}
