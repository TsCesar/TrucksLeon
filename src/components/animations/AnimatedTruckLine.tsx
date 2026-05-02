'use client'

import { motion, useReducedMotion } from 'motion/react'

function TruckSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <filter id="truck-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="trailer-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(215,25,32,0.35)" />
          <stop offset="100%" stopColor="rgba(215,25,32,0.55)" />
        </linearGradient>
        <linearGradient id="cab-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(215,25,32,0.6)" />
          <stop offset="100%" stopColor="rgba(215,25,32,0.8)" />
        </linearGradient>
      </defs>

      {/* Trailer cargo box */}
      <rect x="2" y="8" width="74" height="24" rx="2" fill="url(#trailer-grad)" />
      {/* Trailer panel ribbing */}
      <line x1="22" y1="9" x2="22" y2="31" stroke="rgba(215,25,32,0.2)" strokeWidth="0.8" />
      <line x1="42" y1="9" x2="42" y2="31" stroke="rgba(215,25,32,0.2)" strokeWidth="0.8" />
      <line x1="62" y1="9" x2="62" y2="31" stroke="rgba(215,25,32,0.2)" strokeWidth="0.8" />
      {/* Trailer top edge highlight */}
      <line x1="2" y1="8" x2="76" y2="8" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />

      {/* Cab/tractor unit */}
      <rect x="76" y="11" width="42" height="21" rx="2.5" fill="url(#cab-grad)" />
      {/* Windshield */}
      <rect x="96" y="12" width="20" height="13" rx="1.5" fill="rgba(180,220,255,0.18)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      {/* Cab roof */}
      <rect x="76" y="8" width="30" height="5" rx="1" fill="rgba(215,25,32,0.65)" />
      {/* Air intake / stack detail */}
      <rect x="80" y="4" width="4" height="6" rx="1" fill="rgba(215,25,32,0.4)" />
      {/* Grill panel */}
      <rect x="116" y="13" width="8" height="14" rx="1" fill="rgba(20,20,25,0.8)" stroke="rgba(215,25,32,0.3)" strokeWidth="0.5" />
      {/* Grill lines */}
      <line x1="116" y1="17" x2="124" y2="17" stroke="rgba(215,25,32,0.35)" strokeWidth="0.5" />
      <line x1="116" y1="20" x2="124" y2="20" stroke="rgba(215,25,32,0.35)" strokeWidth="0.5" />
      <line x1="116" y1="23" x2="124" y2="23" stroke="rgba(215,25,32,0.35)" strokeWidth="0.5" />

      {/* Headlight */}
      <rect x="120" y="14" width="7" height="6" rx="1" fill="rgba(255,245,200,0.65)" filter="url(#truck-glow)" />
      {/* Headlight glow on road */}
      <ellipse cx="126" cy="32" rx="8" ry="2" fill="rgba(255,245,150,0.08)" />

      {/* Bumper */}
      <rect x="117" y="30" width="10" height="3" rx="0.8" fill="rgba(180,180,190,0.4)" />

      {/* Chassis bar */}
      <rect x="2" y="31" width="125" height="3" rx="0.5" fill="rgba(215,25,32,0.75)" />

      {/* Trailer rear wheels */}
      <circle cx="16" cy="38" r="7" fill="#12141a" stroke="rgba(215,25,32,0.65)" strokeWidth="1.5" />
      <circle cx="16" cy="38" r="3" fill="rgba(215,25,32,0.4)" />
      <circle cx="16" cy="38" r="1.2" fill="rgba(255,255,255,0.2)" />
      <circle cx="30" cy="38" r="7" fill="#12141a" stroke="rgba(215,25,32,0.65)" strokeWidth="1.5" />
      <circle cx="30" cy="38" r="3" fill="rgba(215,25,32,0.4)" />
      <circle cx="30" cy="38" r="1.2" fill="rgba(255,255,255,0.2)" />

      {/* Drive axle wheels */}
      <circle cx="78" cy="38" r="7" fill="#12141a" stroke="rgba(215,25,32,0.65)" strokeWidth="1.5" />
      <circle cx="78" cy="38" r="3" fill="rgba(215,25,32,0.4)" />
      <circle cx="78" cy="38" r="1.2" fill="rgba(255,255,255,0.2)" />
      <circle cx="91" cy="38" r="7" fill="#12141a" stroke="rgba(215,25,32,0.7)" strokeWidth="1.5" />
      <circle cx="91" cy="38" r="3" fill="rgba(215,25,32,0.45)" />
      <circle cx="91" cy="38" r="1.2" fill="rgba(255,255,255,0.2)" />

      {/* Steer wheel */}
      <circle cx="111" cy="38" r="6.5" fill="#12141a" stroke="rgba(215,25,32,0.7)" strokeWidth="1.5" />
      <circle cx="111" cy="38" r="2.8" fill="rgba(215,25,32,0.45)" />
      <circle cx="111" cy="38" r="1.1" fill="rgba(255,255,255,0.2)" />

      {/* Rear tail lights */}
      <rect x="2" y="12" width="4" height="8" rx="0.5" fill="rgba(215,25,32,0.9)" />
      <rect x="2" y="21" width="4" height="4" rx="0.5" fill="rgba(215,25,32,0.5)" />
    </svg>
  )
}

export function AnimatedTruckLine() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06] pointer-events-none" aria-hidden />
    )
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden pointer-events-none" aria-hidden>
      {/* Road base */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.08]" />
      {/* Dashed lane marking */}
      <div
        className="absolute left-0 right-0 h-px opacity-[0.15]"
        style={{
          bottom: '10px',
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 18px, transparent 18px, transparent 36px)',
        }}
      />
      {/* Road shoulder line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Truck + gradient trail */}
      <motion.div
        className="absolute bottom-0 flex items-end"
        animate={{ x: ['-160px', 'calc(100vw + 160px)'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      >
        {/* Light trail behind the truck */}
        <div className="w-40 h-px bg-gradient-to-r from-transparent to-red-accent/35 self-end mb-[3px]" />
        <TruckSVG className="w-[90px] sm:w-[115px] h-auto" />
      </motion.div>
    </div>
  )
}
