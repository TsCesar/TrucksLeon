import NextImage, { type ImageProps } from 'next/image'
import { assetPath } from '@/lib/paths'

/**
 * next/image with the base path applied.
 *
 * Next prefixes `/_next/*` assets with `basePath` automatically, but the `src`
 * of an <Image> only goes through the optimiser — and the GitHub Pages build
 * sets `images.unoptimized`, so the raw src is emitted verbatim and a
 * "/images/…" path would resolve to the domain root instead of /TrucksLeon/.
 *
 * Every image in the app imports this instead of next/image, so the prefix is
 * applied in exactly one place. Keep the paths in data/ and call sites
 * unprefixed — assetPath is a no-op ('' prefix) in the normal build.
 */
export function Image({ src, ...props }: ImageProps) {
  return <NextImage src={typeof src === 'string' ? assetPath(src) : src} {...props} />
}
