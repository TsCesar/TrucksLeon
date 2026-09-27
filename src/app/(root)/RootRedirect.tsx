'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { defaultLocale } from '@/config/locales'
import { assetPath } from '@/lib/paths'

/**
 * Static-export stand-in for `redirect('/es')`.
 *
 * `redirect()` is a server-side 307 and cannot be emitted by `output: 'export'`,
 * so on GitHub Pages the root page ships this instead. `router.replace` applies
 * the basePath itself, so the target stays the plain '/es'. The <noscript> meta
 * refresh needs a real URL, hence assetPath().
 */
export function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/${defaultLocale}`)
  }, [router])

  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${assetPath(`/${defaultLocale}/`)}`} />
      </noscript>
      <main
        style={{
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          font: '500 0.875rem/1.5 system-ui, sans-serif',
          color: 'rgb(95 102 114)',
          background: 'rgb(247 248 250)',
        }}
      >
        <a href={assetPath(`/${defaultLocale}/`)}>TrucksLeón</a>
      </main>
    </>
  )
}
