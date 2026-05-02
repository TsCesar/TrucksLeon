'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

export function ProcessConnector() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <div
      ref={ref}
      className="hidden lg:block absolute top-[2.25rem] left-[calc(12.5%+1.125rem)] right-[calc(12.5%+1.125rem)] h-px overflow-visible"
      aria-hidden
    >
      <div className="absolute inset-0 bg-white/5" />
      {!reduced && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-accent/60 via-red-accent/30 to-transparent origin-left"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
        />
      )}
      {!reduced && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-accent -translate-x-1/2"
          style={{ boxShadow: '0 0 10px rgba(215,25,32,0.9), 0 0 20px rgba(215,25,32,0.4)' }}
          initial={{ left: '0%', opacity: 0 }}
          animate={isInView ? { left: '100%', opacity: [0, 1, 1, 0] } : { left: '0%', opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.5 }}
        />
      )}
    </div>
  )
}
