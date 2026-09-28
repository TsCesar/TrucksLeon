/**
 * Geo-IP and language-preference matrix.
 *
 *   GEO_COUNTRY_HEADER=x-test-country npm start
 *   node scripts/check-geo.mjs http://localhost:3000 x-test-country
 *
 * Exercises the root redirect against a running server by injecting the country
 * header the deployment is configured to trust, so the whole matrix runs with no
 * hosting provider involved and no real IP anywhere.
 *
 * What it pins down:
 *   - the country -> language map, including Austria -> German;
 *   - every unlisted country falling through to English;
 *   - a missing or malformed header falling through to English;
 *   - a valid cookie outranking the country;
 *   - a corrupt cookie being ignored rather than trusted;
 *   - an explicit locale in the URL never being touched, whatever the country;
 *   - unprefixed paths still resolving to Spanish, with no geo involvement;
 *   - the root redirect being temporary and uncacheable.
 */

const BASE = process.argv[2] ?? 'http://localhost:3000'
const HEADER = process.argv[3] ?? 'x-test-country'
const COOKIE = 'trucksleon_locale'

const problems = []
let checks = 0

async function head(path, { country, cookie } = {}) {
  const headers = {}
  if (country !== undefined) headers[HEADER] = country
  if (cookie !== undefined) headers.cookie = `${COOKIE}=${cookie}`
  const res = await fetch(BASE + path, { headers, redirect: 'manual' })
  return {
    status: res.status,
    location: res.headers.get('location'),
    cacheControl: res.headers.get('cache-control'),
    source: res.headers.get('x-locale-source'),
  }
}

function expect(label, actual, wanted) {
  checks++
  if (actual !== wanted) problems.push(`${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(wanted)}`)
  return actual === wanted
}

/** `/` must redirect to exactly this locale. */
async function root(label, opts, wantedLocale, wantedSource) {
  const r = await head('/', opts)
  const path = r.location ? new URL(r.location, BASE).pathname : null
  const ok =
    expect(`${label} status`, r.status, 307) &&
    expect(`${label} target`, path, `/${wantedLocale}`) &&
    expect(`${label} source`, r.source, wantedSource)
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(34)} -> ${path ?? '(none)'} [${r.source ?? '-'}]`)
}

/** A path that already names its language must be served untouched. */
async function untouched(label, path, opts) {
  const r = await head(path, opts)
  checks++
  const ok = r.status === 200
  if (!ok) problems.push(`${label}: ${path} returned ${r.status} -> ${r.location}`)
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(34)} -> ${r.status}${r.location ? ' ' + r.location : ''}`)
}

console.log(`\nGeo matrix against ${BASE}  (header: ${HEADER})\n`)

console.log('country -> language, no cookie')
await root('ES', { country: 'ES' }, 'es', 'geo')
await root('FR', { country: 'FR' }, 'fr', 'geo')
await root('DE', { country: 'DE' }, 'de', 'geo')
await root('NL', { country: 'NL' }, 'nl', 'geo')
await root('AT (agreed -> German)', { country: 'AT' }, 'de', 'geo')

console.log('\nunlisted and unusable countries fall back to English')
await root('IT', { country: 'IT' }, 'en', 'fallback')
await root('PT', { country: 'PT' }, 'en', 'fallback')
await root('BE (never guessed)', { country: 'BE' }, 'en', 'fallback')
await root('CH (never guessed)', { country: 'CH' }, 'en', 'fallback')
await root('no header at all', {}, 'en', 'fallback')
await root('empty header', { country: '' }, 'en', 'fallback')
await root('lowercase es', { country: 'es' }, 'es', 'geo')
await root('padded " FR "', { country: ' FR ' }, 'fr', 'geo')
await root('malformed "ESP"', { country: 'ESP' }, 'en', 'fallback')
await root('malformed "1"', { country: '1' }, 'en', 'fallback')

console.log('\na manual choice outranks the country')
await root('cookie=fr + ES', { country: 'ES', cookie: 'fr' }, 'fr', 'cookie')
await root('cookie=en + DE', { country: 'DE', cookie: 'en' }, 'en', 'cookie')
await root('cookie=nl + FR', { country: 'FR', cookie: 'nl' }, 'nl', 'cookie')
await root('cookie=es, no country', { cookie: 'es' }, 'es', 'cookie')

console.log('\na cookie that is not one of the five is ignored')
await root('cookie=xx + ES', { country: 'ES', cookie: 'xx' }, 'es', 'geo')
await root('cookie=<script> + ES', { country: 'ES', cookie: '<script>' }, 'es', 'geo')
await root('cookie=../../etc + DE', { country: 'DE', cookie: '../../etc' }, 'de', 'geo')
await root('cookie empty + NL', { country: 'NL', cookie: '' }, 'nl', 'geo')

console.log('\nan explicit locale is never re-routed by geo')
await untouched('/es with country FR', '/es', { country: 'FR' })
await untouched('/fr/contacto with country DE', '/fr/contacto', { country: 'DE' })
await untouched('/en with cookie=de + ES', '/en', { country: 'ES', cookie: 'de' })
await untouched('/de/europa with country IT', '/de/europa', { country: 'IT' })
await untouched('/nl with country ES', '/nl', { country: 'ES' })

console.log('\nunprefixed paths stay deterministic (Spanish), geo never applies')
for (const [path, wanted] of [
  ['/europa', '/es/europa'],
  ['/vehiculos-entregados', '/es/vehiculos-entregados'],
]) {
  const r = await head(path, { country: 'DE', cookie: 'fr' })
  const got = r.location ? new URL(r.location, BASE).pathname : null
  checks++
  const ok = got === wanted
  if (!ok) problems.push(`${path} with DE+cookie=fr went to ${got}, expected ${wanted}`)
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${path.padEnd(34)} -> ${got}`)
}

console.log('\nthe root redirect is personal: temporary and uncacheable')
{
  const r = await head('/', { country: 'ES' })
  checks++
  if (r.status === 301 || r.status === 308) problems.push(`root redirect is permanent (${r.status})`)
  checks++
  if (!/no-store/.test(r.cacheControl ?? '')) {
    problems.push(`root Cache-Control lacks no-store: ${r.cacheControl}`)
  }
  console.log(`  status=${r.status}  cache-control=${r.cacheControl}`)
}

console.log(`\n${checks} assertions`)
if (problems.length) {
  console.error(`\nGEO CHECK FAILED — ${problems.length} problem(s)\n`)
  for (const p of problems) console.error('  ✖ ' + p)
  process.exit(1)
}
console.log('GEO CHECK PASSED')
