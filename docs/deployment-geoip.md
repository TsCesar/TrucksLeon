# Geo-IP locale routing

**Status: IMPLEMENTED, disabled by default.**

The logic lives in `src/lib/geo.ts` and is wired into `src/middleware.ts`.
It activates only when the hosting platform supplies a country header and that
header is named in `GEO_COUNTRY_HEADER`. With the variable unset — the default —
`/` resolves to `/en` for new visitors and everything else behaves normally.

Not available on GitHub Pages, which is a static host with no request-time
logic; the export keeps its client-side bounce to `/es`.

## Requirement

When a visitor lands on the **site root** (`https://trucksleon.com/`), resolve an
approximate country from their IP and redirect to the matching locale.

| Country                | Target |
| ---------------------- | ------ |
| Spain (ES)             | `/es`  |
| France (FR)            | `/fr`  |
| Germany (DE)           | `/de`  |
| Netherlands (NL)       | `/nl`  |
| Austria (AT)           | `/de`  — pending confirmation |
| Any other country      | `/en`  |
| Detection unavailable  | `/en`  |

Examples of countries that fall through to `/en`: Italy, Portugal, Poland,
Sweden, Belgium, Switzerland, United Kingdom, Denmark, Czechia.

## Rules

1. **Root only.** The redirect applies exclusively to `/`. A request that
   already carries a locale segment (`/es/...`, `/fr/...`, `/de/...`, `/nl/...`,
   `/en/...`) must be served as-is and never rewritten.
2. **A manual choice wins.** Once the visitor picks a language in the switcher,
   that choice takes priority over Geo-IP on subsequent visits. Persist it
   (cookie or equivalent) and check it before any IP lookup.
3. **Fail open to `/en`.** Any lookup error, timeout or missing header resolves
   to `/en`. Detection must never block the response.
4. **Do not store the IP address.** Only the derived country code may be used,
   and only for the duration of the request. No logging of the address.

## Where it lives

`src/lib/geo.ts` holds the policy (country map, cookie parsing, precedence) so
it can be tested on its own. `src/middleware.ts` applies it to `/` and nothing
else.

### Provider independence

No provider is hard-coded. One header name is read, and only the one named in
the server-side `GEO_COUNTRY_HEADER`:

```
GEO_COUNTRY_HEADER=cf-ipcountry          # Cloudflare
GEO_COUNTRY_HEADER=x-vercel-ip-country   # Vercel
GEO_COUNTRY_HEADER=x-geoip-country       # reverse proxy / GeoIP module
```

A list of plausible header names is deliberately NOT scanned. Any client can
send `x-country: FR`; only a header the platform overwrites on every request
means anything. With the variable unset, a request carrying
`x-vercel-ip-country: ES` is ignored outright — verified.

### Verification

`npm run check:geo` runs the full matrix against a running server, injecting the
configured header. 78 assertions covering the country map, fallbacks, cookie
precedence, corrupt cookies, untouched explicit locales and the cache headers.

> **Resolved in Fase 4.** The middleware used to sit at the repository root,
> where Next.js never loaded it (with a `src/` directory it resolves middleware
> from `src/middleware.ts`), so `/contacto` answered 404 instead of redirecting.
> It now lives at `src/middleware.ts`, the manifest registers it, and unprefixed
> paths redirect to the default locale. `scripts/build-pages.mjs` stashes the
> file from its real location for the static export.
>
> It is deliberately configured with **`localeDetection: false`**. next-intl
> would otherwise choose the locale from the `Accept-Language` header, which is
> automatic language selection — the very thing this document defers to Fase 5.
> Turning Geo-IP on therefore means changing one flag and adding the country
> lookup, not rewiring the routing.

The country code comes from the platform, not from a third-party API call:

- Vercel: `x-vercel-ip-country`
- Cloudflare: `cf-ipcountry`
- Netlify: `x-nf-client-connection-ip` + Netlify Edge `context.geo.country.code`

## Prerequisites

- The site must be served from a host with request-time edge execution.
  GitHub Pages cannot do this and stays the demo/staging target.
- `trucksleon.com` must be pointed at that host. No DNS or custom-domain change
  is to be made before Fase 5.
