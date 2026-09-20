'use client'

import { Image } from '@/components/ui/Image'
import { motion, useReducedMotion } from 'motion/react'

/**
 * The TrucksLeón trailer crossing the bottom band of the hero.
 * Enters from well off-screen left and exits off-screen right, on a light
 * technical road line.
 *
 * One asset for every breakpoint. There used to be three PNGs (mobile /
 * square / wide, 1.2–1.6 MB each, all three marked `priority`) that were the
 * same artwork on differently padded canvases — up to 86% transparent margin.
 * Because the padding counted towards the box, a `height: 140px` on mobile
 * drew the truck itself at roughly 23px tall, which is why it read as a
 * speck. `truck-line.webp` is trimmed to the artwork (1400x381, 72 KB), so
 * the rendered size is the truck's real size and it can be driven by width.
 *
 * Decorative, never the LCP element: no `priority`.
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
      className="absolute bottom-0 left-0 right-0 h-[132px] sm:h-[172px] lg:h-[218px] overflow-hidden pointer-events-none z-[5]"
      aria-hidden
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 38%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 38%)',
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
        className="absolute bottom-[6px] left-0 flex items-end will-change-transform"
        initial={{ x: '-115vw' }}
        animate={{ x: '115vw' }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1.5,
        }}
      >
        {/* Tail-light trail */}
        <div
          className="self-end mb-[4px] flex-shrink-0 w-[60px] sm:w-[90px] lg:w-[120px]"
          style={{
            height: 1,
            background:
              'linear-gradient(to right, transparent, rgba(215,25,32,0.15), rgba(215,25,32,0.4))',
          }}
        />

        {/* Sized by width so the truck keeps real presence on small screens:
            ~78vw at 390px ≈ 304px wide, i.e. it genuinely crosses the hero. */}
        <Image
          src="/images/vehicles/truck-line.webp"
          alt=""
          width={1400}
          height={381}
          sizes="(max-width: 639px) 78vw, (max-width: 1023px) 46vw, 640px"
          className="block max-w-none flex-shrink-0 h-auto w-[78vw] sm:w-[46vw] lg:w-[560px] xl:w-[640px]"
          style={{ filter: 'drop-shadow(0 14px 18px rgb(15 23 42 / 0.16))' }}
        />
      </motion.div>
    </div>
  )
}
