'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'

/**
 * The TrucksLeón trailer crossing the bottom band of the hero.
 * Enters from well off-screen left and exits off-screen right, on a light
 * technical road line. The artwork is red-and-white on transparency, so it
 * carries the brand at full strength against the light ground.
 */
export function AnimatedTruckLine() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-px bg-line/10 pointer-events-none" aria-hidden />
    )
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[140px] sm:h-[186px] lg:h-[248px] overflow-hidden pointer-events-none z-[5]"
      aria-hidden
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 42%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 42%)',
      }}
    >
      {/* Road surface */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-line/[0.10]" />
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          bottom: 14,
          opacity: 0.5,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgb(15 23 42 / 0.16) 0, rgb(15 23 42 / 0.16) 22px, transparent 22px, transparent 44px)',
        }}
      />

      {/* Truck — enters from well off-screen left, exits off-screen right */}
      <motion.div
        className="absolute bottom-0 left-0 flex items-end will-change-transform"
        initial={{ x: '-110vw' }}
        animate={{ x: '110vw' }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1.5,
        }}
      >
        {/* Tail-light trail */}
        <div
          className="self-end mb-[2px] flex-shrink-0"
          style={{
            width: 120,
            height: 1,
            background:
              'linear-gradient(to right, transparent, rgba(215,25,32,0.15), rgba(215,25,32,0.4))',
          }}
        />

        {/* Mobile – portrait */}
        <Image
          src="/images/vehicles/truck-hero-mobile-transparent.png"
          alt=""
          width={300}
          height={400}
          style={{ height: 140, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 12px 16px rgb(15 23 42 / 0.14))' }}
          className="block sm:hidden max-w-none flex-shrink-0"
          priority
        />

        {/* Tablet – square */}
        <Image
          src="/images/vehicles/truck-hero-square-transparent.png"
          alt=""
          width={400}
          height={400}
          style={{ height: 186, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 14px 20px rgb(15 23 42 / 0.14))' }}
          className="hidden sm:block lg:hidden max-w-none flex-shrink-0"
          priority
        />

        {/* Desktop – wide */}
        <Image
          src="/images/vehicles/truck-hero-wide-transparent.png"
          alt=""
          width={800}
          height={300}
          style={{ height: 248, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 18px 26px rgb(15 23 42 / 0.14))' }}
          className="hidden lg:block max-w-none flex-shrink-0"
          priority
        />
      </motion.div>
    </div>
  )
}
