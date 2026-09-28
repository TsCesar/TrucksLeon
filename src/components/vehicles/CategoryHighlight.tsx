'use client'

import { useEffect } from 'react'
import { vehicleCategories } from '@/data/vehicleCategories'

const validSlugs = new Set(vehicleCategories.map((c) => c.slug))

/**
 * Honours `?categoria=<slug>` on /vehiculos by marking the matching card as
 * selected and bringing it into view. The home preview links here with it.
 *
 * Read from `window.location` after mount rather than `useSearchParams`, so the
 * page stays fully static (no Suspense bailout, works in the Pages export) and
 * the server HTML is identical with or without the parameter. The slug is
 * technical and shared by all five locales. Missing, empty or unknown values
 * select nothing: every category stays visible and the page is a normal 200.
 */
export function CategoryHighlight() {
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('categoria')
    if (!slug || !validSlugs.has(slug)) return

    const card = document.querySelector<HTMLElement>(`[data-category-slug="${slug}"]`)
    if (!card) return
    card.dataset.selected = 'true'
    card.setAttribute('aria-current', 'true')
    card.scrollIntoView({ block: 'center' })
  }, [])

  return null
}
