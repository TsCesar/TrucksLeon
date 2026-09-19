'use client'

import { motion, useReducedMotion } from 'motion/react'

/** Hairline between sections with a slow red sweep — the connective tissue
 *  between bands of white, mist and red. */
export function SectionTransition() {
  const reduced = useReducedMotion()

  return (
    <div className="relative h-px overflow-hidden bg-canvas" aria-hidden>
      {/* Base line — fades out at both ends */}
      <div className="absolute inset-0 rule-fade" />

      {/* Edge dots */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-red-accent/40" />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-red-accent/40" />

      {!reduced && (
        <>
          {/* Wide gradient sweep */}
          <motion.div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-red-accent/70 to-transparent"
            style={{ width: '22%' }}
            animate={{ x: ['-100%', '540%'] }}
            transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 7, ease: 'easeInOut' }}
          />
          {/* Pinpoint spark */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(215,25,32,0.95)',
              boxShadow: '0 0 8px 2px rgba(215,25,32,0.35)',
            }}
            animate={{ x: ['-5px', '100vw'] }}
            transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 7, ease: 'easeInOut' }}
          />
        </>
      )}
    </div>
  )
}
