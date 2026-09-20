/**
 * Physically optimises the public/ artwork.
 *
 *   node scripts/optimize-images.mjs
 *
 * GitHub Pages serves with `images.unoptimized`, so Next's optimiser never
 * runs there and whatever sits in public/ is exactly what users download.
 * These sources were PNGs of 1.2–1.6 MB each, most of it transparent padding.
 *
 * What it does:
 *   - trims the fully transparent margin (the hero truck canvases were up to
 *     86% empty, which also made the artwork render far too small for its box)
 *   - resizes to the largest size actually used in the layout
 *   - writes WebP, keeping the alpha channel
 *
 * Sources live in assets-src/ (outside public/) so the ~9 MB of originals are
 * never published to GitHub Pages, which serves public/ verbatim. Only the
 * generated WebP under public/images/ ships. Nothing is deleted.
 */

import sharp from 'sharp'
import { statSync, existsSync } from 'node:fs'

const JOBS = [
  // One asset for every breakpoint: the three "variants" were the same artwork.
  {
    src: 'assets-src/vehicles/truck-hero-wide-transparent.png',
    out: 'public/images/vehicles/truck-line.webp',
    trim: true,
    width: 1400,
    quality: 82,
  },
  {
    src: 'assets-src/hero/hero-truck-main.png',
    out: 'public/images/hero/hero-truck-main.webp',
    trim: true,
    width: 900,
    quality: 84,
  },
  {
    src: 'assets-src/Europe/MapaEuropa.png',
    out: 'public/images/Europe/MapaEuropa.webp',
    trim: false,
    width: 1448, // keep 1:1 with the SVG overlay viewBox
    quality: 80,
  },
]

const kb = (p) => (statSync(p).size / 1024).toFixed(0)

let before = 0
let after = 0

for (const job of JOBS) {
  if (!existsSync(job.src)) {
    console.log(`skip (missing) ${job.src}`)
    continue
  }
  let img = sharp(job.src)

  if (job.trim) {
    // Drop the fully transparent border so the visible artwork fills the file.
    img = img.trim({ threshold: 0 })
  }

  const meta = await img.toBuffer({ resolveWithObject: true })
  img = sharp(meta.data).resize({
    width: Math.min(job.width, meta.info.width),
    withoutEnlargement: true,
  })

  await img.webp({ quality: job.quality, effort: 6, alphaQuality: 90 }).toFile(job.out)

  const outMeta = await sharp(job.out).metadata()
  before += statSync(job.src).size
  after += statSync(job.out).size
  console.log(
    `${job.src.replace('assets-src/', '').padEnd(42)} ${kb(job.src).padStart(6)}KB  ->  ` +
      `${job.out.replace('public/images/', '').padEnd(34)} ${kb(job.out).padStart(6)}KB  ` +
      `(${outMeta.width}x${outMeta.height})`
  )
}

console.log(
  `\nTOTAL  ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB  ` +
    `(-${(100 - (after / before) * 100).toFixed(1)}%)`
)
