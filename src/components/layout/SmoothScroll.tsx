'use client'

import { useEffect } from 'react'

/**
 * Smooth scrolling is deliberately NOT enabled.
 *
 * Lenis was driving a permanent requestAnimationFrame loop with duration 1.2,
 * which hijacked wheel and touch scrolling on every page. Measured against
 * native scrolling it cost a continuous main-thread tick for no visual gain,
 * and on touch it produced the rubbery lag the site was being criticised for.
 *
 * Native scrolling is momentum-correct on every current browser, is handled
 * off the main thread, and starts instantly. The component stays as a mount
 * point so the layout does not need to change, and to keep `scroll-behavior`
 * honest for in-page anchor links.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Anchor links (#servicios etc.) should glide; everything else is native.
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) root.style.scrollBehavior = 'smooth'
    return () => {
      root.style.scrollBehavior = ''
    }
  }, [])

  return null
}
