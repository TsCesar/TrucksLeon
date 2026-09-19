'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type RoomEntryProps = {
  children: ReactNode
  className?: string
  tiltX?: number
  tiltY?: number
}

export function RoomEntry({ children, className, tiltX = 7, tiltY = 0 }: RoomEntryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 1.0', 'start 0.72'],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [tiltX, 0])
  const rotateY = useTransform(scrollYProgress, [0, 1], [tiltY, 0])
  const z = useTransform(scrollYProgress, [0, 1], [-90, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.38], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])

  const cfg = { stiffness: 52, damping: 15 }
  const sRX = useSpring(rotateX, cfg)
  const sRY = useSpring(rotateY, cfg)
  const sZ = useSpring(z, cfg)
  const sScale = useSpring(scale, cfg)

  if (reduced) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div
      ref={ref}
      style={{ perspective: '1400px', perspectiveOrigin: '50% 38%', overflow: 'visible' }}
    >
      <motion.div
        className={className}
        style={{
          rotateX: sRX,
          rotateY: sRY,
          z: sZ,
          scale: sScale,
          opacity,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
