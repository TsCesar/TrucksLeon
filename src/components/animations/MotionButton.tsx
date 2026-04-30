'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type MotionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function MotionButton({ children, className, ...props }: MotionButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={className}
      {...(props as object)}
    >
      {children}
    </motion.button>
  )
}
