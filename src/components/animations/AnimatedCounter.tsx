'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'

type Props = {
  target: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}

export function AnimatedCounter({ target, prefix = '', suffix = '', className, duration = 2000 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const val = useMotionValue(0)
  const spring = useSpring(val, { duration, bounce: 0 })

  useEffect(() => {
    if (isInView) val.set(target)
  }, [isInView, target, val])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`
      }
    })
  }, [spring, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
