'use client'

import { Image } from '@/components/ui/Image'
import { motion, useReducedMotion } from 'motion/react'

/*
  COORDINATE SYSTEM — single source of truth
  ------------------------------------------
  MapaEuropa.png is 1448×1086 (aspect 1.3333). The container is locked to that
  aspect ratio, the image fills it, and the SVG uses viewBox "0 0 100 75"
  (same 1.3333 aspect) with preserveAspectRatio="xMidYMid meet". So one SVG
  unit maps 1:1 onto the image: x = px/1448·100, y = px/1086·75.

  Node positions below are VISUAL CENTROIDS measured directly off the source
  bitmap on that 100×75 grid (the map is drawn on a conic projection, so no
  lat/lon formula reproduces them — they were read from the artwork).

  ARC = 2: northward bow applied identically to the visible route lines AND to
  the convoy path (arcPath / convoyPath share the same formula).
*/

type MapNode = {
  id: string
  x: number
  y: number
  hub?: boolean
  /** label offset from dot center */
  lx: number
  ly: number
  hideLabelMobile?: boolean
}

const NODES: MapNode[] = [
  // ── Iberian Peninsula ───────────────────────────────────────────────────────
  { id: 'ES', x: 15,   y: 59, hub: true, lx: 3,    ly: 0    },
  { id: 'PT', x: 9,    y: 60,            lx: -5.5, ly: 1.5  },
  // ── Western Europe ──────────────────────────────────────────────────────────
  { id: 'FR', x: 26,   y: 47,            lx: -6.5, ly: 0    },
  { id: 'GB', x: 27,   y: 35,            lx: 2.5,  ly: -2   },
  { id: 'NL', x: 35.7, y: 38,            lx: 2.5,  ly: -2,   hideLabelMobile: true },
  { id: 'BE', x: 34,   y: 40.5,            lx: -5.5, ly: 1.5, hideLabelMobile: true },
  // ── Central Europe ──────────────────────────────────────────────────────────
  { id: 'DE', x: 40,   y: 42,            lx: 2.5,  ly: 0    },
  { id: 'CH', x: 36.6, y: 51,            lx: -6,   ly: 1,   hideLabelMobile: true },
  { id: 'AT', x: 46,   y: 48,            lx: 2.5,  ly: 1.5, hideLabelMobile: true },
  { id: 'CZ', x: 46,   y: 44,            lx: 2.5,  ly: -2,  hideLabelMobile: true },
  // ── Southern Europe ─────────────────────────────────────────────────────────
  { id: 'IT', x: 42,   y: 57,            lx: 2.5,  ly: 0    },
  // ── Northern / Eastern Europe ───────────────────────────────────────────────
  { id: 'DK', x: 40.5, y: 32,            lx: 2.5,  ly: -2   },
  { id: 'SE', x: 48,   y: 18,            lx: 2.5,  ly: 0    },
  { id: 'PL', x: 51,   y: 39,            lx: 2.5,  ly: 0    },
]

/** Single source of truth — visible lines AND convoy use these same pairs. */
const ROUTE_PAIRS: [string, string][] = [
  ['PT', 'ES'],
  ['ES', 'FR'],
  ['FR', 'GB'],
  ['FR', 'BE'],
  ['BE', 'NL'],
  ['BE', 'DE'],
  ['DE', 'DK'],
  ['DK', 'SE'],
  ['DE', 'PL'],
  ['DE', 'CZ'],
  ['DE', 'AT'],
  ['FR', 'CH'],
  ['CH', 'IT'],
]

const nodeMap = new Map(NODES.map((n) => [n.id, n]))

/** Northward bow in SVG units — same value for visible paths and animateMotion */
const ARC = 2

/** Quadratic bezier between two nodes. Used for every visible route line. */
function arcPath(from: MapNode, to: MapNode): string {
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2 - ARC
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`
}

// Convoy: ES → FR → DE, built with the same formula as arcPath().
// The dot travels on the EXACT same bezier as the two visible route segments.
const convoyPath = (() => {
  const es = nodeMap.get('ES')!
  const fr = nodeMap.get('FR')!
  const de = nodeMap.get('DE')!
  const mx1 = (es.x + fr.x) / 2,  my1 = (es.y + fr.y) / 2 - ARC
  const mx2 = (fr.x + de.x) / 2,  my2 = (fr.y + de.y) / 2 - ARC
  return `M ${es.x} ${es.y} Q ${mx1} ${my1} ${fr.x} ${fr.y} Q ${mx2} ${my2} ${de.x} ${de.y}`
})()

export function EuropeRouteMap() {
  const reduced = useReducedMotion()

  return (
    <div
      className="europe-map-panel relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: '1448 / 1086' }}
      aria-hidden="true"
    >
      {/* ── BASE IMAGE ── knocked back to a technical landmass on the panel */}
      <Image
        src="/images/Europe/MapaEuropa.png"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="europe-map-img object-contain"
        priority={false}
      />

      {/* ── SVG ROUTES + NODES ── */}
      <svg
        viewBox="0 0 100 75"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="hub-glow-es" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#D71920" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D71920" stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* ── ROUTE LINES ── */}
        {ROUTE_PAIRS.map(([fromId, toId], i) => {
          const from = nodeMap.get(fromId)
          const to   = nodeMap.get(toId)
          if (!from || !to) return null
          return (
            <motion.path
              key={`${fromId}-${toId}`}
              d={arcPath(from, to)}
              stroke="rgba(239,68,74,0.75)"
              strokeWidth="0.55"
              fill="none"
              strokeDasharray="2 2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      pathLength: { duration: 1.5, delay: 0.4 + i * 0.06, ease: 'easeOut' },
                      opacity:    { duration: 0.25, delay: 0.4 + i * 0.06 },
                    }
              }
            />
          )
        })}

        {/* ── COUNTRY NODES ── */}
        {NODES.map((node, i) =>
          node.hub ? (
            <g key={node.id}>
              {/* Ambient glow */}
              <circle cx={node.x} cy={node.y} r={7} fill="url(#hub-glow-es)" />

              {/* Pulse rings */}
              <motion.circle
                cx={node.x} cy={node.y} r={2.2}
                fill="transparent" stroke="#EF444A" strokeWidth="0.5"
                animate={reduced ? {} : { r: [2.2, 8], opacity: [0.75, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 2 }}
              />
              <motion.circle
                cx={node.x} cy={node.y} r={1.5}
                fill="transparent" stroke="#EF444A" strokeWidth="0.4"
                animate={reduced ? {} : { r: [1.5, 5.5], opacity: [0.55, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 2.7 }}
              />

              {/* Core dot */}
              <motion.circle
                cx={node.x} cy={node.y} r={2.2} fill="#EF444A"
                initial={{ r: 0 }}
                whileInView={{ r: 2.2 }}
                viewport={{ once: true }}
                transition={reduced ? { duration: 0 } : { delay: 0.4, type: 'spring', stiffness: 280 }}
              />

              <text
                x={node.x + node.lx} y={node.y + node.ly}
                fill="#FF6166" fontSize="3.2"
                fontFamily="ui-monospace, monospace" fontWeight="bold"
                dominantBaseline="middle"
              >
                {node.id}
              </text>
            </g>
          ) : (
            <g key={node.id}>
              <motion.circle
                cx={node.x} cy={node.y} r={1.3}
                fill="rgba(239,68,74,0.9)"
                initial={{ r: 0, opacity: 0 }}
                whileInView={{ r: 1.3, opacity: 1 }}
                viewport={{ once: true }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { delay: 0.9 + i * 0.05, type: 'spring', stiffness: 280 }
                }
              />
              <text
                x={node.x + node.lx} y={node.y + node.ly}
                fill="rgba(226,232,240,0.82)" fontSize="2.5"
                fontFamily="ui-monospace, monospace"
                dominantBaseline="middle"
                className={node.hideLabelMobile ? 'europe-label-dense' : undefined}
              >
                {node.id}
              </text>
            </g>
          )
        )}

        {/*
          CONVOY: ES → FR → DE
          <animateMotion> follows convoyPath, which is built with the identical
          arcPath() formula used for the two visible route segments. One path,
          two uses — no independent coordinates for the animation.
        */}
        {!reduced && (
          <circle r={1.8} fill="#EF444A">
            <animateMotion
              path={convoyPath}
              dur="6s"
              repeatCount="indefinite"
              begin="2s"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.08;0.88;1"
              dur="6s"
              repeatCount="indefinite"
              begin="2s"
            />
          </circle>
        )}
      </svg>
    </div>
  )
}
