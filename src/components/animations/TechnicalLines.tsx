'use client'

import { motion, useReducedMotion } from 'motion/react'

interface TechnicalLinesProps {
  className?: string
  lineCount?: number
  showAccentLine?: boolean
  showScanner?: boolean
  intensity?: 'subtle' | 'normal'
  accentColor?: string
  baseColor?: string
}

export function TechnicalLines({
  className = '',
  lineCount = 5,
  showAccentLine = false,
  showScanner = false,
  intensity = 'subtle',
  accentColor = '#D71920',
  baseColor,
}: TechnicalLinesProps) {
  const reduced = useReducedMotion()

  const resolvedBase = baseColor ?? (
    intensity === 'subtle'
      ? 'rgb(15 23 42 / 0.055)'
      : 'rgb(15 23 42 / 0.09)'
  )
  const cornerOpacity = intensity === 'subtle' ? '0.35' : '0.7'

  const lines = Array.from({ length: lineCount }, (_, i) => i)

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Horizontal scan lines — never red unless showAccentLine */}
      {lines.map((i) => {
        const top = `${(100 / (lineCount + 1)) * (i + 1)}%`
        const isAccent = showAccentLine && i === Math.floor(lineCount / 2)
        return (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{ top, backgroundColor: isAccent ? accentColor : resolvedBase }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={reduced ? { scaleX: 1, opacity: 1 } : { scaleX: [0, 1], opacity: [0, 1] }}
            transition={{
              duration: reduced ? 0 : 1.2,
              delay: reduced ? 0 : i * 0.15,
              ease: 'easeOut',
            }}
          />
        )
      })}

      {/* Vertical tick marks */}
      {[10, 25, 50, 75, 90].map((pct) => (
        <motion.div
          key={pct}
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${pct}%`, backgroundColor: resolvedBase }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={reduced ? { scaleY: 1, opacity: 1 } : { scaleY: [0, 1], opacity: [0, 0.6] }}
          transition={{
            duration: reduced ? 0 : 1.4,
            delay: reduced ? 0 : pct * 0.008,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Scanner — opt-in only */}
      {showScanner && !reduced && (
        <motion.div
          className="absolute top-0 bottom-0 w-[2px] opacity-30"
          style={{ backgroundColor: accentColor }}
          animate={{ x: ['0vw', '100vw'] }}
          transition={{ duration: 8, ease: 'linear', repeat: Infinity, repeatDelay: 4 }}
        />
      )}

      {/* Corner brackets */}
      {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos, idx) => {
        const isRight = pos.includes('right')
        const isBottom = pos.includes('bottom')
        return (
          <motion.svg
            key={idx}
            className={`absolute w-6 h-6 ${pos}`}
            viewBox="0 0 24 24"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 1 : [0, 1] }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.8 + idx * 0.1 }}
          >
            <path
              d={
                !isRight && !isBottom ? 'M0 12 L0 0 L12 0' :
                isRight && !isBottom  ? 'M12 0 L24 0 L24 12' :
                !isRight && isBottom  ? 'M0 12 L0 24 L12 24' :
                                        'M12 24 L24 24 L24 12'
              }
              stroke={resolvedBase}
              strokeWidth="1.5"
              opacity={cornerOpacity}
            />
          </motion.svg>
        )
      })}
    </div>
  )
}
