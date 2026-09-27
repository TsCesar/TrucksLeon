import { Archivo, IBM_Plex_Mono } from 'next/font/google'

/**
 * Shared font instances.
 *
 * `next/font` must be initialised at module scope, and both root layouts
 * (`(root)/layout.tsx` and `[locale]/layout.tsx`) need the same CSS variables.
 * Declaring them once here keeps a single preloaded copy of each family rather
 * than two independent instances.
 */

// Archivo carries a width axis — display type runs expanded (see --display-stretch).
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})
