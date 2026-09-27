/**
 * Builds the shared Open Graph / Twitter card image.
 *
 *   node scripts/build-og-image.mjs
 *
 * Output: public/images/og/og-trucksleon.png at exactly 1200x630, the size
 * every social platform crops from.
 *
 * It composites, rather than screenshotting a page: an off-white ground with
 * the same technical grid the site uses, the corporate red rule, the existing
 * logo and hero tractor unit, and the brand lock-up. That keeps it on-identity
 * (white / graphite / red / industrial vehicle) and small — a rendered page
 * capture would be several hundred KB of noise.
 *
 * Re-run this only when the brand assets or the tagline change; the PNG is
 * committed so no build step depends on it.
 */

import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'og')
const outFile = join(outDir, 'og-trucksleon.png')

const W = 1200
const H = 630

const INK = '#111318'
const STEEL = '#5F6672'
const RED = '#D71920'

/** Background: off-white wash, technical grid, red blooms, corner brackets. */
const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="55%" stop-color="#F7F8FA"/>
      <stop offset="100%" stop-color="#EFF1F5"/>
    </linearGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgb(15 23 42 / 0.055)" stroke-width="1"/>
    </pattern>
    <radialGradient id="bloomA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ground)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <ellipse cx="90" cy="120" rx="420" ry="360" fill="url(#bloomA)"/>
  <ellipse cx="1130" cy="560" rx="320" ry="280" fill="url(#bloomA)"/>

  <!-- Red rule down the left edge, as on every page -->
  <rect x="0" y="0" width="10" height="${H}" fill="${RED}"/>

  <!-- Corner brackets -->
  <path d="M 54 92 L 54 54 L 92 54" fill="none" stroke="${RED}" stroke-opacity="0.3" stroke-width="3"/>
  <path d="M ${W - 92} 54 L ${W - 54} 54 L ${W - 54} 92" fill="none" stroke="${RED}" stroke-opacity="0.3" stroke-width="3"/>
  <path d="M 54 ${H - 92} L 54 ${H - 54} L 92 ${H - 54}" fill="none" stroke="${RED}" stroke-opacity="0.3" stroke-width="3"/>
  <path d="M ${W - 92} ${H - 54} L ${W - 54} ${H - 54} L ${W - 54} ${H - 92}" fill="none" stroke="${RED}" stroke-opacity="0.3" stroke-width="3"/>
</svg>`)

/** Foreground type. Uses system sans so the script needs no font files. */
const copy = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>
    .eyebrow { font: 600 20px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; letter-spacing: 4px; fill: ${RED}; }
    .claim   { font: 700 58px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; letter-spacing: -1.6px; fill: ${INK}; }
    .sub     { font: 400 25px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; fill: ${STEEL}; }
    .meta    { font: 600 21px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; letter-spacing: 1.6px; fill: ${STEEL}; }
  </style>

  <text class="eyebrow" x="92" y="232">ESPECIALISTAS EN EUROPA</text>

  <text class="claim" x="90" y="308">Gestión integral</text>
  <text class="claim" x="90" y="374">de vehículos industriales</text>
  <text class="claim" x="90" y="440">en Europa</text>

  <text class="sub" x="92" y="496">TRUCKS LEON INTERNATIONAL, S.L. — León, España</text>

  <rect x="92" y="536" width="54" height="3" fill="${RED}"/>
  <text class="meta" x="92" y="578">+15 PAÍSES · 24/7 · TRUCKSLEON.COM</text>
</svg>`)

mkdirSync(outDir, { recursive: true })

const logo = await sharp(join(root, 'public', 'images', 'brand', 'logo-trucksleon.png'))
  .resize({ width: 300, fit: 'inside', withoutEnlargement: true })
  .toBuffer()

// The tractor unit, knocked back so the type stays the subject.
const truck = await sharp(join(root, 'public', 'images', 'hero', 'hero-truck-main.webp'))
  .resize({ width: 640, fit: 'inside' })
  .composite([
    {
      input: Buffer.from([255, 255, 255, 105]),
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer()

const truckMeta = await sharp(truck).metadata()

await sharp(background)
  .composite([
    { input: truck, left: W - truckMeta.width + 96, top: Math.round((H - truckMeta.height) / 2) + 34 },
    { input: copy, left: 0, top: 0 },
    { input: logo, left: 88, top: 82 },
  ])
  .png({ compressionLevel: 9, palette: true })
  .toFile(outFile)

const { size } = await sharp(outFile).metadata().then(async (m) => ({
  size: (await import('node:fs')).statSync(outFile).size,
  ...m,
}))

const meta = await sharp(outFile).metadata()
console.log(`[og] ${outFile.slice(root.length + 1)} — ${meta.width}x${meta.height}, ${(size / 1024).toFixed(1)} KB`)
