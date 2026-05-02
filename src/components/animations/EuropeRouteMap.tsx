'use client'

import { motion, useReducedMotion } from 'motion/react'

type MapNode = { id: string; x: number; y: number; hub?: boolean }

const NODES: MapNode[] = [
  { id: 'ES', x: 80, y: 162, hub: true },
  { id: 'DE', x: 198, y: 100 },
  { id: 'FR', x: 138, y: 138 },
  { id: 'NL', x: 162, y: 88 },
  { id: 'BE', x: 152, y: 105 },
  { id: 'IT', x: 195, y: 175 },
  { id: 'PT', x: 55, y: 175 },
  { id: 'PL', x: 260, y: 78 },
  { id: 'AT', x: 228, y: 125 },
  { id: 'CH', x: 182, y: 138 },
  { id: 'GB', x: 110, y: 82 },
  { id: 'SE', x: 238, y: 38 },
  { id: 'DK', x: 208, y: 58 },
  { id: 'LU', x: 158, y: 122 },
  { id: 'CZ', x: 230, y: 100 },
]

const ROUTES: [string, string][] = [
  ['PT', 'ES'],
  ['ES', 'FR'],
  ['FR', 'GB'],
  ['FR', 'BE'],
  ['BE', 'LU'],
  ['BE', 'NL'],
  ['LU', 'DE'],
  ['DE', 'DK'],
  ['DK', 'SE'],
  ['DE', 'CZ'],
  ['CZ', 'PL'],
  ['DE', 'AT'],
  ['AT', 'CH'],
  ['CH', 'IT'],
]

const nodeMap = new Map(NODES.map((n) => [n.id, n]))

/*
  Simplified but geographically plausible Europe silhouette.
  ViewBox: 0 0 340 215
  Clockwise from SW Portugal, tracing the coast.
*/
const EUROPE_PATH = `
  M 36,192
  L 30,168 L 30,148 L 36,132 L 40,118 L 50,108 L 68,104
  L 88,105 L 102,109 L 118,116 L 135,122 L 148,126
  L 158,130 L 165,132 L 172,142 L 178,158 L 178,175
  L 172,192 L 183,206 L 196,198 L 206,184 L 212,162
  L 218,148 L 226,138 L 238,128 L 252,122 L 264,115
  L 268,103 L 274,92 L 282,78 L 285,62
  L 270,53 L 254,49 L 238,44 L 224,38
  L 216,28 L 222,20 L 236,14 L 248,20
  L 246,34 L 232,42 L 218,50 L 200,58
  L 184,62 L 167,65 L 152,68 L 140,68
  L 128,72 L 116,76 L 106,86 L 98,98
  L 88,112 L 78,125 L 70,140 L 64,158
  L 54,172 L 44,184 L 36,192 Z
`

/* UK as a separate island */
const UK_PATH = `
  M 108,75 L 113,63 L 117,52 L 120,42
  L 116,32 L 108,26 L 100,30 L 96,40
  L 98,52 L 100,64 L 105,75 L 108,75 Z
`

export function EuropeRouteMap() {
  const reduced = useReducedMotion()

  return (
    <svg
      viewBox="0 0 340 215"
      className="w-full h-auto"
      aria-hidden="true"
    >
      <defs>
        <pattern id="map-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(248,250,252,0.025)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D71920" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#D71920" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background grid */}
      <rect width="340" height="215" fill="url(#map-grid)" />

      {/* Europe continent silhouette */}
      <motion.path
        d={EUROPE_PATH}
        fill="rgba(255,255,255,0.045)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="0.7"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={reduced ? { duration: 0 } : { duration: 1.2, ease: 'easeOut' }}
      />

      {/* UK island */}
      <motion.path
        d={UK_PATH}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.6"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={reduced ? { duration: 0 } : { duration: 1.2, delay: 0.2, ease: 'easeOut' }}
      />

      {/* Route lines */}
      {ROUTES.map(([fromId, toId], i) => {
        const from = nodeMap.get(fromId)
        const to = nodeMap.get(toId)
        if (!from || !to) return null
        return (
          <motion.path
            key={`${fromId}-${toId}`}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            stroke="rgba(215,25,32,0.45)"
            strokeWidth="0.9"
            fill="none"
            strokeDasharray="3 3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    pathLength: { duration: 1.0, delay: 0.5 + i * 0.06, ease: 'easeOut' },
                    opacity: { duration: 0.2, delay: 0.5 + i * 0.06 },
                  }
            }
          />
        )
      })}

      {/* Country dots */}
      {NODES.map((node, i) =>
        node.hub ? (
          <g key={node.id}>
            {/* Hub glow backdrop */}
            <circle cx={node.x} cy={node.y} r={18} fill="url(#hub-glow)" />
            {/* Pulse ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={6}
              fill="transparent"
              stroke="#D71920"
              strokeWidth="0.8"
              animate={reduced ? {} : { r: [6, 20], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1.5 }}
            />
            {/* Hub dot */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={4.5}
              fill="#D71920"
              initial={{ r: 0 }}
              whileInView={{ r: 4.5 }}
              viewport={{ once: true }}
              transition={reduced ? { duration: 0 } : { delay: 0.5, type: 'spring', stiffness: 250 }}
            />
            <text
              x={node.x + 8}
              y={node.y + 1}
              fill="#D71920"
              fontSize="7.5"
              fontFamily="ui-monospace, monospace"
              fontWeight="bold"
              dominantBaseline="middle"
            >
              {node.id}
            </text>
          </g>
        ) : (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={3}
              fill="rgba(215,25,32,0.7)"
              initial={{ r: 0, opacity: 0 }}
              whileInView={{ r: 3, opacity: 1 }}
              viewport={{ once: true }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { delay: 1.0 + i * 0.04, type: 'spring', stiffness: 280 }
              }
            />
            <text
              x={node.x + 5}
              y={node.y}
              fill="rgba(248,250,252,0.5)"
              fontSize="6.5"
              fontFamily="ui-monospace, monospace"
              dominantBaseline="middle"
            >
              {node.id}
            </text>
          </g>
        )
      )}

      {/* Moving convoy dot along ES → FR → DE → PL */}
      {!reduced && (
        <motion.circle
          r={2}
          fill="#D71920"
          cx={80}
          cy={162}
          animate={{
            cx: [80, 138, 198, 260],
            cy: [162, 138, 100, 78],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'linear',
            delay: 2,
          }}
        />
      )}
    </svg>
  )
}
