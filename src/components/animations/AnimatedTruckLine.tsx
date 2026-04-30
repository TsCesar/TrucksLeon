'use client'

import { motion, useReducedMotion } from 'motion/react'

export function AnimatedTruckLine() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden" aria-hidden>
      <motion.div
        className="h-full bg-gradient-to-r from-transparent via-red-accent to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        style={{ width: '40%' }}
      />
    </div>
  )
}
