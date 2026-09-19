'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Pointer highlight — a small, very faint red wash that follows the cursor.
 *
 * Deliberately restrained for the light theme: 180px, ~5% red at the core,
 * fully transparent by 70%. It adds a trace of warmth to white surfaces
 * without smudging text. RAF + refs only, so it never re-renders React.
 * Skipped entirely on coarse pointers and with reduced motion.
 */
const SIZE = 180
const HALF = SIZE / 2

export function MouseGlow() {
  const elRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const glow = elRef.current
    if (!glow) return

    const LERP = 0.14
    let targetX = -999
    let targetY = -999
    let currentX = -999
    let currentY = -999
    let rafId: number

    function onMove(e: MouseEvent) {
      targetX = e.clientX
      targetY = e.clientY
    }

    function tick() {
      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP
      glow!.style.transform = `translate3d(${currentX - HALF}px, ${currentY - HALF}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={elRef}
      aria-hidden
      className="fixed top-0 left-0 rounded-full pointer-events-none select-none will-change-transform hidden [@media(pointer:fine)]:block"
      style={{
        width: SIZE,
        height: SIZE,
        zIndex: 1,
        transform: 'translate3d(-999px, -999px, 0)',
        background:
          'radial-gradient(circle at center, rgb(var(--c-red-accent) / var(--spot-fill)) 0%, rgb(var(--c-red-accent) / 0.02) 45%, transparent 70%)',
      }}
    />
  )
}
