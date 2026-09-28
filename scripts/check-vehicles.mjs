/**
 * ?categoria= on /{locale}/vehiculos.
 *
 *   npm start
 *   node scripts/check-vehicles.mjs http://localhost:3000
 *
 * What it pins down, in two locales:
 *   - no parameter, empty, or unknown slug -> 200, all categories, none selected;
 *   - a valid slug -> 200, all categories, exactly that one selected;
 *   - the canonical never carries the query string;
 *   - the sitemap never lists a ?categoria= variant.
 */

import { chromium } from 'playwright'

const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const LOCALES = ['es', 'en']
const VALID = 'cabezas-tractoras'
const TOTAL = 12

const problems = []
let checks = 0

function expect(label, actual, wanted) {
  checks++
  const ok = actual === wanted
  if (!ok) problems.push(`${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(wanted)}`)
  return ok
}

function canonicalOf(html) {
  const tag = html.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0]
  const href = tag?.match(/href="([^"]+)"/)?.[1]
  return href ? new URL(href).pathname.replace(/\/$/, '') + new URL(href).search : null
}

const browser = await chromium.launch()
const page = await browser.newPage()

for (const locale of LOCALES) {
  const path = `/${locale}/vehiculos`
  const cases = [
    { label: 'no param', query: '', selected: null },
    { label: 'empty', query: '?categoria=', selected: null },
    { label: 'valid', query: `?categoria=${VALID}`, selected: VALID },
    { label: 'unknown', query: '?categoria=no-existe', selected: null },
  ]

  for (const c of cases) {
    const label = `${path}${c.query}`
    const res = await fetch(BASE + path + c.query)
    const html = await res.text()
    let ok = expect(`${label} status`, res.status, 200)
    ok = expect(`${label} canonical`, canonicalOf(html)?.endsWith(path) ?? false, true) && ok

    await page.goto(BASE + path + c.query, { waitUntil: 'networkidle' })
    const total = await page.locator('[data-category-slug]').count()
    const selected = await page
      .locator('[data-category-slug][data-selected="true"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-category-slug')))
    ok = expect(`${label} categories shown`, total, TOTAL) && ok
    ok = expect(`${label} selected`, selected.join(',') || null, c.selected) && ok

    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(44)} ${total} shown, selected: ${selected.join(',') || '-'}`)
  }
}

await browser.close()

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const leaked = expect('sitemap has no ?categoria= URLs', sitemap.includes('categoria'), false)
console.log(`  ${leaked ? 'ok  ' : 'FAIL'} sitemap has no ?categoria= URLs`)

console.log(`\n${checks - problems.length}/${checks} checks passed`)
if (problems.length) {
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
