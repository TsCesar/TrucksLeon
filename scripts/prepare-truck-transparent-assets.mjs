/**
 * Removes white/near-white border-connected background from truck PNG images.
 * Uses BFS flood-fill from all 4 border edges — interior whites (trailer) are preserved
 * as long as a dark boundary separates them from the background.
 *
 * Output: *-transparent.png variants alongside originals.
 * Run: node scripts/prepare-truck-transparent-assets.mjs
 *
 * Both sides live in assets-src/, outside public/: these are intermediate
 * artwork, not shipped assets. scripts/optimize-images.mjs turns the wide
 * transparent PNG into the public/images/vehicles/truck-line.webp the site
 * actually loads.
 */

import sharp from 'sharp'
import { existsSync } from 'fs'

const PAIRS = [
  {
    src: 'assets-src/vehicles/truck-hero-wide.png',
    dst: 'assets-src/vehicles/truck-hero-wide-transparent.png',
  },
  {
    src: 'assets-src/vehicles/truck-hero-square.png',
    dst: 'assets-src/vehicles/truck-hero-square-transparent.png',
  },
  {
    src: 'assets-src/vehicles/truck-hero-mobile.png',
    dst: 'assets-src/vehicles/truck-hero-mobile-transparent.png',
  },
]

// BG pixels: all R,G,B channels >= THRESHOLD are treated as "white-ish"
// Lower = catches more light-gray fringe around vehicle edges
const THRESHOLD = 218

async function removeBg(srcPath, dstPath) {
  if (!existsSync(srcPath)) {
    console.warn(`SKIP (not found): ${srcPath}`)
    return
  }

  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  console.log(`Processing ${srcPath}: ${width}x${height} channels=${channels}`)

  function pIdx(x, y) {
    return (y * width + x) * channels
  }

  function isWhitish(x, y) {
    const i = pIdx(x, y)
    return data[i] >= THRESHOLD && data[i + 1] >= THRESHOLD && data[i + 2] >= THRESHOLD
  }

  const visited = new Uint8Array(width * height) // 0 = unvisited, 1 = in queue/done
  const queue = [] // stores flat pixel index = y*width+x

  function tryEnqueue(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return
    const flat = y * width + x
    if (visited[flat] || !isWhitish(x, y)) return
    visited[flat] = 1
    queue.push(flat)
  }

  // Seed from all 4 borders
  for (let x = 0; x < width; x++) {
    tryEnqueue(x, 0)
    tryEnqueue(x, height - 1)
  }
  for (let y = 1; y < height - 1; y++) {
    tryEnqueue(0, y)
    tryEnqueue(width - 1, y)
  }

  // BFS — all border-connected whitish pixels become transparent
  let head = 0
  while (head < queue.length) {
    const flat = queue[head++]
    const x = flat % width
    const y = Math.floor(flat / width)
    data[pIdx(x, y) + 3] = 0 // alpha = 0

    tryEnqueue(x - 1, y)
    tryEnqueue(x + 1, y)
    tryEnqueue(x, y - 1)
    tryEnqueue(x, y + 1)
  }

  console.log(`  Removed ${queue.length} background pixels (${((queue.length / (width * height)) * 100).toFixed(1)}% of image)`)

  // Soft edge feathering: pixels adjacent to transparent BG but not themselves BG
  // get partial transparency to reduce hard white halo at vehicle edges.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const flat = y * width + x
      if (visited[flat]) continue // already transparent
      const i = pIdx(x, y)
      if (data[i + 3] === 0) continue // already fully transparent

      // Check if any 4-connected neighbor is transparent BG
      const hasTransNeighbor =
        (x > 0 && data[pIdx(x - 1, y) + 3] === 0 && visited[(y) * width + (x - 1)]) ||
        (x < width - 1 && data[pIdx(x + 1, y) + 3] === 0 && visited[(y) * width + (x + 1)]) ||
        (y > 0 && data[pIdx(x, y - 1) + 3] === 0 && visited[(y - 1) * width + x]) ||
        (y < height - 1 && data[pIdx(x, y + 1) + 3] === 0 && visited[(y + 1) * width + x])

      if (hasTransNeighbor) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        const brightness = (r + g + b) / 3
        // If edge pixel is quite bright (residual bg halo), partially fade it
        if (brightness > 210) {
          const fade = (brightness - 210) / 45 // 0..1
          data[i + 3] = Math.max(0, Math.round(255 * (1 - fade * 0.85)))
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(dstPath)

  console.log(`  Saved: ${dstPath}`)
}

console.log('=== Transparent truck asset generator ===\n')
for (const { src, dst } of PAIRS) {
  await removeBg(src, dst)
}
console.log('\nDone. Review the output PNGs before deploying.')
