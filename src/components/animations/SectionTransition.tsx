'use client'

import { motion, useReducedMotion } from 'motion/react'

export function SectionTransition() {
  const reduced = useReducedMotion()

  return (
    <div className="relative h-px overflow-hidden" aria-hidden>
      {/* Base line */}
      <div className="absolute inset-0 bg-white/[0.06]" />

      {!reduced && (
        <>
          {/* Wide gradient sweep */}
          <motion.div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-red-accent/40 to-transparent"
            style={{ width: '30%' }}
            animate={{ x: ['-100%', '430%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
          />
          {/* Pinpoint glow riding the sweep */}
          <motion.div
            className="absolute top-0 bottom-0"
            style={{ width: '4px', background: 'rgba(215,25,32,0.85)', boxShadow: '0 0 8px rgba(215,25,32,0.7)' }}
            animate={{ x: ['-4px', '100vw'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
          />
        </>
      )}
    </div>
  )
}
