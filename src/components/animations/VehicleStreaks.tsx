'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

// European cab-over semi — Volvo/Scania style silhouette
function TruckShape() {
  return (
    <svg viewBox="0 0 300 82" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Trailer body */}
      <rect x="0" y="10" width="172" height="46" rx="2" />
      {/* Trailer underframe/skirt */}
      <rect x="4" y="56" width="168" height="5" rx="1" opacity="0.6" />
      {/* Trailer rib lines */}
      <rect x="44" y="11" width="1.2" height="44" opacity="0.18" fill="#FFFFFF" />
      <rect x="88" y="11" width="1.2" height="44" opacity="0.18" fill="#FFFFFF" />
      <rect x="132" y="11" width="1.2" height="44" opacity="0.18" fill="#FFFFFF" />
      {/* Cab body — cab-over European style */}
      <path d="M177 9 L177 57 L272 57 L272 26 L260 9 Z" />
      {/* Roof air deflector */}
      <path d="M177 9 L260 9 L264 2 L181 2 Z" />
      {/* Windshield cutout */}
      <path d="M183 14 L183 44 L258 44 L258 28 L248 14 Z" opacity="0.22" fill="#FFFFFF" />
      {/* Cab visor strip */}
      <rect x="183" y="12" width="76" height="4" rx="1" opacity="0.35" fill="#FFFFFF" />
      {/* Grill face */}
      <rect x="263" y="26" width="9" height="26" rx="1.5" />
      {/* Bumper step */}
      <rect x="260" y="53" width="14" height="6" rx="1" opacity="0.8" />
      {/* Fuel tank */}
      <rect x="177" y="46" width="16" height="14" rx="2" opacity="0.7" />
      {/* Side mirror */}
      <rect x="272" y="22" width="6" height="9" rx="1" opacity="0.75" />
      {/* Wheels — rear trailer axle pair + front */}
      <circle cx="32" cy="67" r="11" />
      <circle cx="60" cy="67" r="11" />
      <circle cx="110" cy="67" r="11" />
      <circle cx="138" cy="67" r="11" />
      {/* Drive axle pair */}
      <circle cx="210" cy="67" r="11" />
      <circle cx="238" cy="67" r="11" />
      {/* Steer axle */}
      <circle cx="256" cy="67" r="9" />
      {/* Wheel hubs */}
      <circle cx="32" cy="67" r="4" opacity="0.3" fill="#FFFFFF" />
      <circle cx="60" cy="67" r="4" opacity="0.3" fill="#FFFFFF" />
      <circle cx="110" cy="67" r="4" opacity="0.3" fill="#FFFFFF" />
      <circle cx="138" cy="67" r="4" opacity="0.3" fill="#FFFFFF" />
      <circle cx="210" cy="67" r="4" opacity="0.3" fill="#FFFFFF" />
      <circle cx="238" cy="67" r="4" opacity="0.3" fill="#FFFFFF" />
      <circle cx="256" cy="67" r="3.5" opacity="0.3" fill="#FFFFFF" />
    </svg>
  )
}

// Executive sedan silhouette — 3-box profile
function CarShape() {
  return (
    <svg viewBox="0 0 160 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Lower body — sill to wheel arches */}
      <path d="M8 34 L8 40 L152 40 L152 34 L144 30 L16 30 Z" />
      {/* Hood + trunk deck */}
      <path d="M14 30 L22 20 L56 18 L104 18 L136 22 L144 30 Z" />
      {/* Roofline */}
      <path d="M38 20 L46 10 L112 10 L120 20 Z" />
      {/* Windows */}
      <path d="M42 19 L48 12 L76 12 L76 19 Z" opacity="0.25" fill="#FFFFFF" />
      <path d="M79 19 L79 12 L108 12 L114 19 Z" opacity="0.25" fill="#FFFFFF" />
      {/* B-pillar */}
      <rect x="77" y="11" width="2" height="9" opacity="0.35" fill="#FFFFFF" />
      {/* Front lights */}
      <rect x="144" y="26" width="8" height="4" rx="1" opacity="0.6" />
      {/* Rear lights */}
      <rect x="10" y="26" width="6" height="5" rx="1" opacity="0.55" />
      {/* Wheels */}
      <circle cx="42" cy="41" r="10" />
      <circle cx="118" cy="41" r="10" />
      {/* Wheel hubs */}
      <circle cx="42" cy="41" r="4" opacity="0.28" fill="#FFFFFF" />
      <circle cx="118" cy="41" r="4" opacity="0.28" fill="#FFFFFF" />
    </svg>
  )
}

export function VehicleStreaks() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Detail cutouts are painted white so they read as knock-outs of the
  // silhouette on a light ground (the body itself is currentColor at low alpha).
  // Large truck: drifts right
  const truck1X = useTransform(scrollYProgress, [0, 1], ['-42vw', '128vw'])
  // Medium truck: drifts left (opposing lane)
  const truck2X = useTransform(scrollYProgress, [0, 1], ['118vw', '-32vw'])
  // Car: drifts right, faster
  const car1X = useTransform(scrollYProgress, [0.05, 0.85], ['-20vw', '122vw'])
  // Distant small truck: slow drift right
  const truck3X = useTransform(scrollYProgress, [0, 1], ['-6vw', '68vw'])

  if (reduced) return null

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden
    >
      {/* Large truck — foreground lane */}
      <motion.div
        className="absolute text-ink/[0.05]"
        style={{ x: truck1X, top: '14%', width: 320 }}
      >
        <TruckShape />
      </motion.div>

      {/* Medium truck — opposing lane, flipped */}
      <motion.div
        className="absolute text-ink/[0.035]"
        style={{ x: truck2X, top: '56%', width: 210, scaleX: -1 }}
      >
        <TruckShape />
      </motion.div>

      {/* Car — mid depth */}
      <motion.div
        className="absolute text-ink/[0.044]"
        style={{ x: car1X, top: '34%', width: 155 }}
      >
        <CarShape />
      </motion.div>

      {/* Tiny distant truck — barely visible */}
      <motion.div
        className="absolute text-ink/[0.02]"
        style={{ x: truck3X, top: '74%', width: 115 }}
      >
        <TruckShape />
      </motion.div>
    </div>
  )
}
