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

The natural home is the Next.js middleware, which already exists for locale
prefixing:

- `middleware.ts` — currently at the repository root.

> **Note for whoever implements this — verified 2026-09-26.** With a `src/`
> directory, Next.js resolves middleware from `src/middleware.ts`. The file at
> the repository root is **not** being picked up, so the `next-intl` middleware
> it exports is inert today. Confirmed against the production server: `/`
> returns 307 (that comes from `src/app/page.tsx`'s `redirect()`, not from
> middleware) while `/contacto` and `/servicios` return **404** instead of
> redirecting to `/es/contacto` and `/es/servicios` as the middleware would.
> Move the file to `src/middleware.ts` before adding any Geo-IP logic, or the
> logic will silently never run. Moving it also switches on next-intl's locale
> negotiation for unprefixed paths, which changes routing site-wide — so it is
> a change to make and test deliberately, not a side effect.
> `scripts/build-pages.mjs` stashes `middleware.ts` from the root during the
> static export, so that path also needs updating at the same time.

The country code comes from the platform, not from a third-party API call:

- Vercel: `x-vercel-ip-country`
- Cloudflare: `cf-ipcountry`
- Netlify: `x-nf-client-connection-ip` + Netlify Edge `context.geo.country.code`

## Prerequisites

- The site must be served from a host with request-time edge execution.
  GitHub Pages cannot do this and stays the demo/staging target.
- `trucksleon.com` must be pointed at that host. No DNS or custom-domain change
  is to be made before Fase 5.
