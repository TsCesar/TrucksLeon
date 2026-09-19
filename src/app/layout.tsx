import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'
import { siteConfig } from '@/config/site'
import { MouseGlow } from '@/components/animations/MouseGlow'
import { assetPath } from '@/lib/paths'
import './globals.css'

// Archivo carries a width axis — display type runs expanded (see --display-stretch).
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  // Metadata icon hrefs are emitted verbatim — basePath is not applied here.
  icons: {
    icon: assetPath('/images/brand/logo-trucksleon.png'),
    shortcut: assetPath('/images/brand/logo-trucksleon.png'),
    apple: assetPath('/images/brand/logo-trucksleon.png'),
  },
}

export const viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <MouseGlow />
        {children}
      </body>
    </html>
  )
}
