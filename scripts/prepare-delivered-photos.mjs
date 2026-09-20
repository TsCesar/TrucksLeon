/**
 * Turns the photographs published on trucksleon.com/catalogo into the
 * optimised WebP set under public/images/delivered/.
 *
 *   node scripts/prepare-delivered-photos.mjs <sourceDir>
 *
 * <sourceDir> holds the originals downloaded from the live catalogue, named
 * "<slug>-NN.jpg" (see SELECTION below). They are the company's own photos of
 * the vehicles it actually delivered — the previous public/images/delivered/*
 * PNGs were generic stock cut-outs of unrelated trucks, several of them the
 * wrong marque entirely.
 *
 * Covers are capped at 1100px (card renders ~440px, so 2x DPR), galleries at 1400px.
 */

import sharp from 'sharp'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC = process.argv[2]
if (!SRC) {
  console.error('usage: node scripts/prepare-delivered-photos.mjs <sourceDir>')
  process.exit(1)
}

const OUT = 'public/images/delivered'
mkdirSync(OUT, { recursive: true })

/**
 * slug -> { out, cover, gallery }
 *  cover   : index of the shot used on the card
 *  gallery : indices kept for the detail view, cover first
 * Near-duplicates and shots too small to enlarge were left out.
 */
const SELECTION = [
  { slug: 'volvo-fh12-440-hormigonera-8x4', out: 'volvo-fm12-hormigonera', cover: 1, gallery: [1, 3, 4, 5, 7] },
  { slug: 'scania-g400', out: 'scania-g400', cover: 1, gallery: [1, 2, 3, 4] },
  { slug: 'iveco-stralis-500-6x2-euro-5', out: 'iveco-stralis-500', cover: 3, gallery: [3, 4, 5, 6, 2, 10] },
  // 1844: the source page also carries IMG_E0486/IMG_0487 (indices 5-6), which
  // show a different truck from the other four. Left out on purpose.
  { slug: 'marcedes-1844-caja-pezzaioli', out: 'mercedes-1844-pezzaioli', cover: 4, gallery: [4, 1, 2, 3] },
  { slug: 'mb-2550', out: 'mercedes-2550-v8', cover: 1, gallery: [1, 2] },
  { slug: 'daf-xf-510-retarder-superspace-cab', out: 'daf-xf-510-superspace', cover: 1, gallery: [1, 2, 3] },
  { slug: 'daf-xf-460-retarder', out: 'daf-xf-460-retarder', cover: 1, gallery: [1, 2, 3] },
  { slug: 'volvo-2013-fh13-540', out: 'volvo-fh13-540', cover: 3, gallery: [3, 1, 2, 4] },
  { slug: 'daf-460-special-edition', out: 'daf-460-special-edition', cover: 1, gallery: [1, 2, 3, 4, 5] },
  { slug: 'pezzaioli-sba31u', out: 'pezzaioli-sba31u', cover: 1, gallery: [1, 2, 3] },
  { slug: 'dtec', out: 'dtec-extensible', cover: 4, gallery: [4, 1] },
  { slug: 'mercedes-antos-porta-coches', out: 'mercedes-antos-portacoches', cover: 1, gallery: [1, 2, 3, 4] },
]

const src = (slug, n) => join(SRC, `${slug}-${String(n).padStart(2, '0')}.jpg`)
const kb = (p) => statSync(p).size / 1024

let inBytes = 0
let outBytes = 0
let files = 0

for (const item of SELECTION) {
  const written = []
  for (let i = 0; i < item.gallery.length; i++) {
    const n = item.gallery[i]
    const from = src(item.slug, n)
    if (!existsSync(from)) {
      console.log(`  MISSING ${from}`)
      continue
    }
    const isCover = i === 0
    const to = join(OUT, isCover ? `${item.out}.webp` : `${item.out}-${i + 1}.webp`)

    await sharp(from)
      .rotate() // honour EXIF orientation
      .resize({ width: isCover ? 1100 : 1400, withoutEnlargement: true })
      .webp({ quality: isCover ? 76 : 74, effort: 6 })
      .toFile(to)

    inBytes += statSync(from).size
    outBytes += statSync(to).size
    files++
    written.push(`${to.split(/[\\/]/).pop()} ${kb(to).toFixed(0)}KB`)
  }
  console.log(`${item.out.padEnd(30)} ${item.gallery.length} imgs  ${written.join('  ')}`)
}

console.log(
  `\n${files} files   ${(inBytes / 1024 / 1024).toFixed(2)} MB -> ${(outBytes / 1024 / 1024).toFixed(2)} MB ` +
    `(-${(100 - (outBytes / inBytes) * 100).toFixed(1)}%)`
)
