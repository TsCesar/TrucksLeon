# Geo-IP locale routing — pending requirement (Fase 5)

**Status: NOT IMPLEMENTED. Documented only.**

This is a deployment-time requirement for the final hosting/edge platform. It is
deliberately out of scope for Fase 3 (visual polish) and must not be built on
GitHub Pages, which is a static host with no request-time edge logic.

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

## Where it will live

`src/middleware.ts`, which already handles locale prefixing.

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
