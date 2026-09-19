'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type StaggerProps = {
  children: ReactNode
  staggerDelay?: number
  className?: string
  once?: boolean
}

export function Stagger({ children, staggerDelay = 0.07, className, once = true }: StaggerProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, filter: 'blur(8px)', scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          scale: 1,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
