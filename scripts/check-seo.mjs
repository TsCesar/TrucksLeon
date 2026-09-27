/**
 * SEO regression check.
 *
 *   node scripts/check-seo.mjs http://localhost:3000        # server build
 *   node scripts/check-seo.mjs --export out                 # static export
 *
 * Fails (exit 1) on the mistakes that are easy to ship and expensive to notice:
 *
 *   - <html lang> missing or not the locale of the page
 *   - title or meta description empty
 *   - canonical missing, duplicated, or not pointing at the page itself
 *   - hreflang missing a locale, or missing x-default
 *   - `noindex` on a production build, or `index` on the staging build
 *   - a doubled base path (/TrucksLeon/TrucksLeon/) anywhere
 *   - sitemap URLs that disagree with the canonicals
 *
 * It parses the delivered HTML, not the React source: the point is to check
 * what is actually served.
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const LOCALES = ['es', 'en', 'nl', 'de', 'fr']
const PATHS = [
  '',
  '/quienes-somos',
  '/servicios',
  '/vehiculos',
  '/vehiculos-entregados',
  '/proceso',
  '/europa',
  '/novedades',
  '/contacto',
  '/privacidad',
  '/aviso-legal',
]

const args = process.argv.slice(2)
const exportMode = args[0] === '--export'
const target = exportMode ? args[1] ?? 'out' : args[0] ?? 'http://localhost:3000'

const problems = []
const fail = (where, msg) => problems.push(`${where}: ${msg}`)

/** All values of an attribute across matching tags. */
function attrs(html, tagRe, attr) {
  const out = []
  for (const m of html.matchAll(tagRe)) {
    const a = new RegExp(`${attr}="([^"]*)"`, 'i').exec(m[0])
    if (a) out.push(a[1])
  }
  return out
}

function parse(html) {
  const htmlTag = /<html[^>]*>/i.exec(html)?.[0] ?? ''
  return {
    lang: /lang="([^"]*)"/i.exec(htmlTag)?.[1] ?? null,
    title: /<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? '',
    description: /<meta name="description" content="([^"]*)"/i.exec(html)?.[1] ?? '',
    canonicals: attrs(html, /<link rel="canonical"[^>]*>/gi, 'href'),
    robots: /<meta name="robots" content="([^"]*)"/i.exec(html)?.[1] ?? '',
    alternates: [...html.matchAll(/<link rel="alternate"[^>]*>/gi)].map((m) => ({
      lang: /hreflang="([^"]*)"/i.exec(m[0])?.[1] ?? '',
      href: /href="([^"]*)"/i.exec(m[0])?.[1] ?? '',
    })),
    ogUrl: /<meta property="og:url" content="([^"]*)"/i.exec(html)?.[1] ?? '',
    ogImage: /<meta property="og:image" content="([^"]*)"/i.exec(html)?.[1] ?? '',
    ogLocale: /<meta property="og:locale" content="([^"]*)"/i.exec(html)?.[1] ?? '',
    twitter: /<meta name="twitter:card" content="([^"]*)"/i.exec(html)?.[1] ?? '',
    jsonLd: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(
      (m) => m[1]
    ),
  }
}

async function fetchDoc(locale, path) {
  if (exportMode) {
    const file = join(target, locale, path.replace(/^\//, ''), 'index.html')
    if (!existsSync(file)) return null
    return readFileSync(file, 'utf8')
  }
  const res = await fetch(`${target}/${locale}${path}`)
  if (!res.ok) return null
  return res.text()
}

async function fetchText(name) {
  if (exportMode) {
    const file = join(target, name)
    return existsSync(file) ? readFileSync(file, 'utf8') : null
  }
  const res = await fetch(`${target}/${name}`)
  return res.ok ? res.text() : null
}

const canonicalsSeen = new Map()

for (const locale of LOCALES) {
  for (const path of PATHS) {
    const where = `/${locale}${path}`
    const html = await fetchDoc(locale, path)
    if (!html) {
      fail(where, 'page could not be read')
      continue
    }

    const d = parse(html)

    if (d.lang !== locale) fail(where, `html lang is ${JSON.stringify(d.lang)}, expected "${locale}"`)
    if (!d.title.trim()) fail(where, 'empty <title>')
    if (d.title.split('|').length > 2) fail(where, `title repeats the brand: ${d.title}`)
    if (!d.description.trim()) fail(where, 'empty meta description')

    if (d.canonicals.length === 0) fail(where, 'no canonical')
    if (d.canonicals.length > 1) fail(where, `${d.canonicals.length} canonicals`)

    const canonical = d.canonicals[0]
    if (canonical) {
      if (!canonical.includes(`/${locale}`)) fail(where, `canonical is not this locale: ${canonical}`)
      if (!canonical.replace(/\/$/, '').endsWith(path.replace(/\/$/, '') || `/${locale}`)) {
        fail(where, `canonical does not point at this page: ${canonical}`)
      }
      const prev = canonicalsSeen.get(canonical)
      if (prev) fail(where, `canonical duplicated, also used by ${prev}`)
      canonicalsSeen.set(canonical, where)
    }

    const langs = d.alternates.map((a) => a.lang)
    for (const l of LOCALES) if (!langs.includes(l)) fail(where, `hreflang missing "${l}"`)
    if (!langs.includes('x-default')) fail(where, 'hreflang missing x-default')

    const noindex = /noindex/i.test(d.robots)
    if (exportMode && !noindex) fail(where, `staging must be noindex, robots="${d.robots}"`)
    if (!exportMode && noindex) fail(where, `production must be indexable, robots="${d.robots}"`)

    if (!d.ogUrl) fail(where, 'no og:url')
    if (!d.ogImage) fail(where, 'no og:image')
    if (!d.ogLocale.includes('_')) fail(where, `og:locale should be a full code, got "${d.ogLocale}"`)
    if (d.twitter !== 'summary_large_image') fail(where, `twitter:card is "${d.twitter}"`)

    if (d.jsonLd.length === 0) fail(where, 'no JSON-LD')
    for (const block of d.jsonLd) {
      try {
        JSON.parse(block)
      } catch {
        fail(where, 'JSON-LD is not valid JSON')
      }
    }

    if (/TrucksLeon\/TrucksLeon/.test(html)) fail(where, 'doubled base path in the document')
  }
}

// robots.txt
const robotsTxt = await fetchText('robots.txt')
if (!robotsTxt) fail('robots.txt', 'missing')
else {
  const disallowAll = /Disallow:\s*\/\s*$/m.test(robotsTxt)
  if (disallowAll) {
    // Staging is excluded by meta robots, which a blocked crawler never reads.
    fail('robots.txt', 'must not disallow everything — the noindex has to be readable')
  }
  if (exportMode && /Sitemap:/i.test(robotsTxt)) fail('robots.txt', 'staging must not publish a sitemap')
  if (!exportMode && !/Sitemap:/i.test(robotsTxt)) fail('robots.txt', 'production should link the sitemap')
}

// sitemap.xml
const sitemap = await fetchText('sitemap.xml')
if (!sitemap) fail('sitemap.xml', 'missing')
else {
  const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1])
  const expected = LOCALES.length * PATHS.length
  if (locs.length !== expected) fail('sitemap.xml', `${locs.length} urls, expected ${expected}`)
  if (locs.some((u) => /TrucksLeon\/TrucksLeon/.test(u))) fail('sitemap.xml', 'doubled base path')
  for (const u of locs) {
    if (!canonicalsSeen.has(u)) fail('sitemap.xml', `url is not any page's canonical: ${u}`)
  }
}

const mode = exportMode ? `static export (${target})` : `server (${target})`
if (problems.length) {
  console.error(`SEO CHECK FAILED — ${mode}\n`)
  for (const p of problems) console.error('  ✖ ' + p)
  console.error(`\n${problems.length} problem(s)`)
  process.exit(1)
}

console.log(`SEO CHECK PASSED — ${mode}`)
console.log(`  ${LOCALES.length * PATHS.length} pages · canonicals unique · hreflang complete · robots correct · sitemap consistent`)
