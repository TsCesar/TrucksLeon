import type { Metadata } from 'next'
import { archivo, plexMono } from '@/lib/fonts'
import { defaultLocale } from '@/config/locales'
import { allowIndexing } from '@/lib/indexing'
import '../globals.css'

/**
 * `/` is a bounce to `/es`, never a destination, so it is never indexable.
 *
 * This matters more since staging started allowing crawling: without it, the
 * one page in the export that carried no robots directive would have been the
 * site root — the very URL least wanted in an index. Production keeps `follow`
 * so the link through to the locale home is still traversed.
 */
export const metadata: Metadata = {
  robots: allowIndexing
    ? { index: false, follow: true }
    : { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noarchive: true } },
}

/**
 * Root layout for the bare `/` entry point only.
 *
 * There are deliberately TWO root layouts in this app (see
 * `src/app/[locale]/layout.tsx`). Next.js allows that when no `app/layout.tsx`
 * exists: the topmost layout on each route's path becomes its root layout and
 * renders <html>/<body>. That is what lets the localized tree set
 * `<html lang={locale}>` from its own segment instead of hard-coding one
 * language for the whole site.
 *
 * This branch serves a single page — the `/` redirect — so it stays minimal
 * and declares the default locale. Nothing here is indexable: the normal build
 * answers `/` with a 307 before this renders at all, and the static export
 * ships it purely as a client-side bounce to `/es/`.
 */
export default function RootEntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
