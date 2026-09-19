'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'motion/react'
import { Badge } from '@/components/ui/Badge'
import type { DeliveredVehicle } from '@/data/deliveredVehicles'

/* Placeholder line-art for records without a photograph. Drawn as thin red
   technical linework on the light plate — a blueprint, not a filled shape. */

const STROKE = 'rgba(215,25,32,0.55)'
const STROKE_SOFT = 'rgba(215,25,32,0.28)'
const GLASS = 'rgba(15,23,42,0.05)'

function TruckPlaceholderSVG() {
  return (
    <svg viewBox="0 0 180 80" fill="none" aria-hidden className="w-28 sm:w-36 opacity-80">
      {/* Trailer */}
      <rect x="2" y="14" width="96" height="30" rx="2" fill="rgba(215,25,32,0.05)" stroke={STROKE} strokeWidth="0.9" />
      <line x1="28" y1="15" x2="28" y2="43" stroke={STROKE_SOFT} strokeWidth="0.7" />
      <line x1="54" y1="15" x2="54" y2="43" stroke={STROKE_SOFT} strokeWidth="0.7" />
      <line x1="80" y1="15" x2="80" y2="43" stroke={STROKE_SOFT} strokeWidth="0.7" />
      <rect x="2" y="44" width="97" height="2.5" rx="0.5" fill="rgba(215,25,32,0.45)" />
      {/* Cab */}
      <rect x="98" y="18" width="68" height="26" rx="2" fill="rgba(215,25,32,0.08)" stroke={STROKE} strokeWidth="0.9" />
      <rect x="118" y="19" width="44" height="16" rx="1" fill={GLASS} stroke={STROKE_SOFT} strokeWidth="0.6" />
      <rect x="98" y="13" width="38" height="6" rx="1" fill="rgba(215,25,32,0.14)" />
      <rect x="163" y="20" width="10" height="18" rx="0.8" fill="rgba(15,23,42,0.05)" stroke={STROKE_SOFT} strokeWidth="0.6" />
      <rect x="163" y="17" width="10" height="5" rx="1" fill="rgba(215,25,32,0.18)" />
      <rect x="98" y="44" width="68" height="2.5" rx="0.5" fill="rgba(168,17,24,0.45)" />
      {/* Wheels */}
      {[22, 48, 74, 118, 146].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={54} r={8} fill="none" stroke={STROKE} strokeWidth="1.1" />
          <circle cx={cx} cy={54} r={3.5} fill="rgba(215,25,32,0.2)" />
        </g>
      ))}
    </svg>
  )
}

function CarPlaceholderSVG() {
  return (
    <svg viewBox="0 0 160 70" fill="none" aria-hidden className="w-24 sm:w-32 opacity-80">
      {/* Car body */}
      <path d="M 20,42 L 20,36 Q 20,30 28,26 L 52,18 Q 60,14 72,14 L 104,14 Q 116,14 122,20 L 140,36 L 140,42 Z"
        fill="rgba(215,25,32,0.06)" stroke={STROKE} strokeWidth="0.9" />
      {/* Windows */}
      <path d="M 38,36 L 42,24 Q 44,20 52,20 L 80,20 Q 86,20 88,24 L 92,36 Z"
        fill={GLASS} stroke={STROKE_SOFT} strokeWidth="0.6" />
      <line x1="66" y1="20" x2="66" y2="36" stroke="rgba(15,23,42,0.10)" strokeWidth="0.7" />
      {/* Bumpers */}
      <rect x="16" y="38" width="10" height="4" rx="1" fill="rgba(15,23,42,0.12)" />
      <rect x="136" y="38" width="10" height="4" rx="1" fill="rgba(15,23,42,0.12)" />
      {/* Lights */}
      <rect x="136" y="30" width="8" height="5" rx="1" fill="rgba(215,25,32,0.16)" />
      <rect x="16" y="30" width="8" height="5" rx="1" fill="rgba(215,25,32,0.42)" />
      {/* Wheels */}
      {[42, 120].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={50} r={10} fill="none" stroke={STROKE} strokeWidth="1.2" />
          <circle cx={cx} cy={50} r={4.5} fill="rgba(215,25,32,0.2)" />
        </g>
      ))}
    </svg>
  )
}

type Props = { vehicle: DeliveredVehicle }

function isCarType(vehicle: DeliveredVehicle) {
  const name = vehicle.name.toLowerCase()
  return name.includes('coche') || name.includes('car') || name.includes('auto') || name.includes('sedan') || name.includes('suv')
}

/**
 * Delivered-vehicle card, light catalogue treatment: large photograph on a
 * neutral plate, white body, red brand line, grey technical data, a hairline
 * border that turns red on hover with a small lift.
 */
export function DeliveredVehicleCard({ vehicle }: Props) {
  const t = useTranslations()
  const isCar = isCarType(vehicle)
  const cardRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useTransform(my, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-4, 4])

  const cfg = { stiffness: 200, damping: 24 }
  const springRX = useSpring(rotateX, cfg)
  const springRY = useSpring(rotateY, cfg)

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!cardRef.current || prefersReducedMotion) return
    const rect = cardRef.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: prefersReducedMotion ? 0 : springRX,
        rotateY: prefersReducedMotion ? 0 : springRY,
        transformPerspective: 1000,
      }}
      className="group relative h-full flex flex-col rounded-xl overflow-hidden bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/30 hover:shadow-[0_2px_6px_rgb(15_23_42_/_0.05),0_24px_50px_-26px_rgb(15_23_42_/_0.30)] transition-[border-color,box-shadow] duration-300"
    >
      {/* Photograph — the hero of the card. The source images are cut-outs on
          transparency, so they sit contained on a neutral plate rather than
          being cropped. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-canvas to-mist">
        {vehicle.image ? (
          <>
            <div className="absolute inset-0 tech-grid-sm opacity-60" aria-hidden />
            <div
              className="absolute inset-x-[12%] bottom-[10%] h-[14%] rounded-[50%] blur-xl"
              style={{ background: 'rgb(15 23 42 / 0.10)' }}
              aria-hidden
            />
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              className="object-contain p-4 transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative overflow-hidden bg-canvas">
            <div className="absolute inset-0 tech-grid-sm" aria-hidden />
            {/* Corner brackets */}
            {(['top-3 left-3','top-3 right-3','bottom-3 left-3','bottom-3 right-3'] as const).map((pos, i) => (
              <svg key={i} className={`absolute w-5 h-5 opacity-40 ${pos}`} viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d={i === 0 ? 'M0 10 L0 0 L10 0' : i === 1 ? 'M10 0 L20 0 L20 10' : i === 2 ? 'M0 10 L0 20 L10 20' : 'M10 20 L20 20 L20 10'}
                  stroke="rgba(215,25,32,0.7)" strokeWidth="1.5"
                />
              </svg>
            ))}
            {isCar ? <CarPlaceholderSVG /> : <TruckPlaceholderSVG />}
            <span className="text-steel/60 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase">
              {vehicle.brand}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 z-[2]">
          <Badge variant="outline" className="shadow-card">{t('delivered.badge')}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 p-5 border-t border-line/[0.07]">
        {/* Red index rule that grows on hover */}
        <span
          className="absolute left-0 top-5 bottom-5 w-[2px] rounded-full bg-red-accent scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300"
          aria-hidden
        />
        <p className="text-xs text-red-text font-mono font-semibold uppercase tracking-[0.14em] mb-1.5">{vehicle.brand}</p>
        <h3 className="text-ink font-heading font-semibold text-[0.95rem] leading-snug mb-3">{vehicle.name}</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {vehicle.specs && (
            <span className="text-steel text-xs font-mono">{vehicle.specs}</span>
          )}
          {vehicle.year && (
            <span className="text-steel/75 text-xs font-mono px-2 py-0.5 rounded bg-line/[0.05]">{vehicle.year}</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
