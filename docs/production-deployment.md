# Production deployment

Provider-agnostic. This is a standard Next.js 15 application and runs anywhere
that can run Node — a VPS, a container, a Node-capable shared host, or a
managed platform. No vendor is required and none is assumed.

**Nothing in this document has been executed.** No deployment has been made, no
DNS record touched, no domain moved. It is the checklist for when you choose to.

---

## 1. What the hosting must provide

| Requirement | Why | If unavailable |
| --- | --- | --- |
| **Node.js 20+** | Build and runtime target. | Blocking. |
| **`npm run build` then `npm start`** | Standard Next.js server. Do not set a custom output directory. | Blocking. |
| **API routes** | `/api/contact` sends the form via Resend, server-side. | Form falls back to nothing — must be solved. |
| **Middleware** | Locale prefixing and the root language redirect. | Blocking for `/` and for unprefixed paths. |
| **HTTPS** | The whole site, plus `Secure` on the language cookie. | Blocking. |
| **Custom response headers** | CSP and the other security headers come from `next.config.ts` and work automatically under `npm start`. | Check they are not stripped by a reverse proxy. |
| **A trustworthy country header** | *Optional.* Enables geo language detection on `/`. | Site works fully; `/` resolves to `/en`. See §5. |

**Do NOT deploy production as a static export.** `npm run build:pages` exists
only for the GitHub Pages staging copy: it has no API routes, no middleware and
no geo detection.

## 2. Build and run

```bash
npm ci
npm run build
npm start            # defaults to port 3000; set PORT to change it
```

Behind a reverse proxy (nginx, Caddy, Apache), forward to that port and make
sure the proxy passes through `X-Forwarded-For` and does not strip the headers
Next sets.

> **Environment variables are build inputs, not only runtime inputs.**
> `ALLOW_INDEXING` and `GEO_COUNTRY_HEADER` must be set in the environment
> **before `npm run build`**, and the same values kept for `npm start`.
> Changing them on an already-built deployment is not enough — see §7.

**Proxy and the contact-form throttle.** The rate limit keys on the first
address in `X-Forwarded-For`. That header is only trustworthy if the proxy or
hosting platform **removes or overwrites** any `X-Forwarded-For` sent by the
client; otherwise a client can put any value there and get a fresh bucket per
request. Configure the proxy to set it, not append to a client-supplied one.
Even then the throttle stays best-effort (see §9).

## 3. Environment variables

Set these on the production deployment. Full descriptions in `.env.example`.

| Variable | Production value | Secret | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://trucksleon.com` | no | Canonical, hreflang, OG, sitemap. This is the default, so it can be omitted — set it explicitly anyway. |
| `ALLOW_INDEXING` | `false` at first, `true` at the very end | no | See §7. Server-side. **Set before `npm run build`.** |
| `GEO_COUNTRY_HEADER` | the header your host documents, or unset | no | See §5. Server-side. **Set before build/deploy.** |
| `RESEND_API_KEY` | from the Resend dashboard | **YES** | Never `NEXT_PUBLIC_`. Never in git, logs or this file. |
| `CONTACT_TO_EMAIL` | `info@trucksleon.com` | no | Where submissions land. |
| `CONTACT_FROM_EMAIL` | `no-reply@trucksleon.com` | no | Must be on a Resend-verified domain. |

Any variable prefixed `NEXT_PUBLIC_` is compiled into the browser bundle and is
world-readable. `ALLOW_INDEXING` and `GEO_COUNTRY_HEADER` are deliberately
**not** prefixed: they are policy, read only on the server.

## 4. Email (Resend)

The form is server-side only. The browser never sees the API key.

- **From** is fixed (`CONTACT_FROM_EMAIL`) and must be on a domain verified in
  Resend. **Never** send as the visitor's own address: it fails SPF and DMARC
  for that person's domain and the mail lands in spam.
- **Reply-To** is the visitor's address, so replying from the inbox reaches
  them directly.
- **To** is `CONTACT_TO_EMAIL`, default `info@trucksleon.com`.

### Sending domain — and protecting the existing mailbox

`info@trucksleon.com` already exists and receives real mail. Verifying a domain
in Resend means adding DNS records, which is where mail gets broken by accident.

| Option | What it needs | Pros | Cons |
| --- | --- | --- | --- |
| **Subdomain** `send.trucksleon.com` *(recommended)* | MX + TXT records on the **subdomain only** | Cannot affect the apex zone's MX. Sending reputation kept separate from the corporate mailbox. From becomes `no-reply@send.trucksleon.com`. | From address is slightly less tidy. |
| Apex `trucksleon.com` | SPF/DKIM records on the apex | From stays `no-reply@trucksleon.com`. | Touches the same zone as the corporate MX. An SPF record that replaces rather than merges an existing one will break existing mail flow. |

If the apex is chosen, the SPF record must be **merged** with whatever is there
today, never replaced — a domain may have only one SPF record.

**Recommendation, not implemented:** use `send.trucksleon.com` as the Resend
sending subdomain, to isolate transactional email from the corporate mailbox.
`CONTACT_FROM_EMAIL` in the code and in `.env.example` still reads
`no-reply@trucksleon.com`; change it to `no-reply@send.trucksleon.com` only once
that subdomain is actually verified in Resend.

**Nothing has been added, removed or verified. No DNS record has been touched.**

## 5. Geo language detection (optional)

Full rules in `docs/deployment-geoip.md`. In short: on `/` only, the language is
chosen by cookie, then country, then English.

To enable it you need **one thing** from the hosting provider: the name of a
request header that carries a two-letter country code **and that the platform
overwrites on every request**.

```
GEO_COUNTRY_HEADER=cf-ipcountry          # Cloudflare
GEO_COUNTRY_HEADER=x-vercel-ip-country   # Vercel
GEO_COUNTRY_HEADER=x-geoip-country       # some reverse proxies / GeoIP modules
```

Exactly one header name is read, and only the one you name. A header the
platform does not control is attacker-controlled: without this variable set,
even a request arriving with `x-vercel-ip-country: ES` is ignored entirely.

**Set it before build/deploy.** Configure `GEO_COUNTRY_HEADER` in the
environment before `npm run build` and keep it for `npm start`; if it is added
or changed later, rebuild and redeploy. Which header the final hosting uses is
**not yet decided** — do not guess one; take it from the host's documentation.

**If the host offers nothing:** leave it unset. `/` then resolves to `/en` for
new visitors and to their remembered language for returning ones. Everything
else on the site is unaffected. Geo detection is an enhancement, never a
dependency.

No IP address is read, stored or logged at any point, and no third-party
geolocation service is contacted.

## 6. Deployment checklist

Work top to bottom. **Leave `ALLOW_INDEXING=false` for all of it.**

1. **Deploy** the project to the host. `npm ci && npm run build && npm start`.
2. **Set the environment variables** from §3, with `ALLOW_INDEXING=false`.
3. **Confirm HTTPS** on the final domain, and that plain HTTP redirects to it.
4. **`www` vs apex.** Pick `https://trucksleon.com` as canonical and redirect
   `www.` to it permanently, preserving path and query. Do this at the
   platform/DNS level, never in JavaScript.
5. **Set `GEO_COUNTRY_HEADER`** if the host provides one (§5) — before the
   build, then rebuild/redeploy — and verify with
   `node scripts/check-geo.mjs https://trucksleon.com <header-name>`.
6. **Test the contact form** with one real submission. Confirm: HTTP 200,
   Resend accepted, the mail arrives at `info@trucksleon.com`, Reply-To is the
   sender's address, and accented characters survive. One submission — not a
   batch.
7. **Verify the legacy redirects** — every row in
   `docs/legacy-url-migration.md` should answer 308 and reach a 200 in one hop.
8. **Check `/robots.txt`** — while `ALLOW_INDEXING=false` it allows crawling and
   publishes no sitemap, and every page carries `noindex`. That is correct at
   this stage.
9. **Check `/sitemap.xml`** — 55 URLs, all on `https://trucksleon.com`.
10. **Check canonical and Open Graph** on a few pages — all on the final domain,
    no staging or platform hostname.
11. **Run the full check** against production:
    `node scripts/check-seo.mjs https://trucksleon.com --expect-noindex`
12. **Only when 3–11 all pass**, switch indexing on — **with a new build**, see
    §7: set `ALLOW_INDEXING=true`, run `npm run build`, restart/redeploy that
    new build, then re-run
    `node scripts/check-seo.mjs https://trucksleon.com --expect-index`.
13. **Submit the sitemap** in Google Search Console and keep the old property
    long enough to watch the redirects being followed.

Step 12 is the last one for a reason: an indexable deployment with a wrong
canonical or a broken redirect map is far more expensive to undo than to delay.

## 7. Indexing is opt-in

`ALLOW_INDEXING` must be exactly `true`. Anything else — unset, empty, `1`,
`yes`, `TRUE` — means:

- `noindex, nofollow, noarchive` on every page, plus `googlebot` equivalents
- an `X-Robots-Tag: noindex, nofollow, noarchive` response header
- `robots.txt` that allows crawling but publishes **no** sitemap

That combination is deliberate: `Disallow: /` would stop a crawler fetching the
page, so it would never read the `noindex` that removes it from the index.
Letting it in is what gets the URL dropped.

GitHub Pages is excluded unconditionally, regardless of this variable.

### It is decided at BUILD time

`ALLOW_INDEXING=true` must be in the environment **before `npm run build`**.
The robots meta of prerendered pages is written into the HTML during the build,
and the `X-Robots-Tag` header rule is fixed in the build output from
`next.config.ts`. A process started from a build made with
`ALLOW_INDEXING=false` keeps serving `noindex` even if the variable is later
changed to `true` and the process restarted.

To switch a deployment from `noindex` to indexable:

1. set `ALLOW_INDEXING=true` in the build environment;
2. run a **new** `npm run build`;
3. restart / redeploy **that new build**;
4. verify `/robots.txt` (sitemap line present), the robots meta on a page (no
   `noindex`) and the response headers (no `X-Robots-Tag`) — e.g.
   `node scripts/check-seo.mjs https://trucksleon.com --expect-index`.

Skipping step 2 is the way trucksleon.com gets published with `noindex` by
accident. The same applies in reverse when turning indexing off.

## 8. Rollback

**Before touching the domain**, record:

- every current DNS record for `trucksleon.com` — A, AAAA, CNAME, **MX**, TXT
  (SPF, DKIM, DMARC) — with values and TTLs, exported and saved outside the
  registrar;
- the current nameservers;
- where the old site is hosted and how to reach its control panel.

Then:

1. **Lower TTL first.** At least 24 hours before the switch, drop the TTL on the
   records you will change to 300s. Rollback is then minutes, not a day.
2. **Do not touch MX, SPF, DKIM or DMARC.** The new site sends mail through
   Resend and receives none. Corporate mail must keep flowing throughout.
3. **Keep the old hosting running** until the new site has served the domain
   correctly for at least a week. It is the rollback target.

**To roll back:** restore the previous A/CNAME values from the export and wait
for the TTL. The old site returns. Nothing else needs undoing — no data has
moved, and the new deployment can keep running on its own URL.

**To roll back the application only** (domain unchanged): redeploy the previous
commit. The build is stateless; there is no migration to reverse.

## 9. What this project deliberately does not do

- **No analytics, pixels or marketing cookies.** The only cookie is
  `trucksleon_locale`, which stores a language code and nothing else. That is a
  functional cookie and needs no consent banner. Adding analytics would change
  that.
- **No distributed rate limiting.** `src/lib/rate-limit.ts` is a per-process
  speed bump; its limits are documented in the file. It keys on
  `X-Forwarded-For`, which is only reliable if the proxy strips or overwrites
  the client-supplied value (§2). On a single Node server it
  works as intended. Real protection on the endpoint is Zod validation, length
  caps, a content-type guard and the honeypot.
- **No CAPTCHA.** Not added without evidence of actual abuse.
- **No third-party geolocation service.**
- **No redirect for `/transparencia-de-ia`.** Left as an open business decision
  (404 until decided); see `docs/legacy-url-migration.md`, "Open decision". It
  is deliberately not sent to the home page or the legal notice.
