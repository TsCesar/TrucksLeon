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

function makeVariants(direction: Direction, blur: boolean): Variants {
  const blurVal = blur ? 'blur(10px)' : 'blur(0px)'
  type HiddenState = { opacity: number; y?: number; x?: number; filter?: string; scale?: number }
  const offsets: Record<Direction, HiddenState> = {
    up:    { opacity: 0, y: 32, filter: blurVal, scale: 0.97 },
    down:  { opacity: 0, y: -32, filter: blurVal, scale: 0.97 },
    left:  { opacity: 0, x: -36, filter: blurVal },
    right: { opacity: 0, x: 36, filter: blurVal },
    none:  { opacity: 0, filter: blurVal, scale: 0.98 },
  }
  return {
    hidden: offsets[direction],
    visible: { opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' },
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
