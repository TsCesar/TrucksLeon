'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

type RevealProps = {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  blur?: boolean
}

/**
 * Transform + opacity only. The hidden states used to carry blur(10px), which
 * forced a filter repaint on every revealed block for the whole ramp — the
 * single most expensive thing on the page during scroll, and barely visible.
 * The `blur` prop is kept so call sites do not have to change; it is now a
 * slightly longer travel instead of a filter.
 */
function makeVariants(direction: Direction, blur: boolean): Variants {
  const d = blur ? 32 : 24
  type HiddenState = { opacity: number; y?: number; x?: number; scale?: number }
  const offsets: Record<Direction, HiddenState> = {
    up:    { opacity: 0, y: d, scale: 0.98 },
    down:  { opacity: 0, y: -d, scale: 0.98 },
    left:  { opacity: 0, x: -(d + 4) },
    right: { opacity: 0, x: d + 4 },
    none:  { opacity: 0, scale: 0.98 },
  }
  return {
    hidden: offsets[direction],
    visible: { opacity: 1, y: 0, x: 0, scale: 1 },
  }
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  className,
  once = true,
  blur = true,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={makeVariants(direction, blur)}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
