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
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(248,250,252,0.03)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="340" height="215" fill="url(#map-grid)" />

      {/* Route lines */}
      {ROUTES.map(([fromId, toId], i) => {
        const from = nodeMap.get(fromId)
        const to = nodeMap.get(toId)
        if (!from || !to) return null
        return (
          <motion.path
            key={`${fromId}-${toId}`}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            stroke="rgba(215,25,32,0.3)"
            strokeWidth="0.8"
            fill="none"
            strokeDasharray="3 3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    pathLength: { duration: 1.0, delay: 0.2 + i * 0.06, ease: 'easeOut' },
                    opacity: { duration: 0.2, delay: 0.2 + i * 0.06 },
                  }
            }
          />
        )
      })}

      {/* Country dots */}
      {NODES.map((node, i) =>
        node.hub ? (
          <g key={node.id}>
            {/* Pulse ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={6}
              fill="transparent"
              stroke="#D71920"
              strokeWidth="0.8"
              animate={reduced ? {} : { r: [6, 18], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1.5 }}
            />
            {/* Hub dot */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={4}
              fill="#D71920"
              initial={{ r: 0 }}
              whileInView={{ r: 4 }}
              viewport={{ once: true }}
              transition={reduced ? { duration: 0 } : { delay: 0.2, type: 'spring', stiffness: 250 }}
            />
            <text
              x={node.x + 7}
              y={node.y + 1}
              fill="#D71920"
              fontSize="7"
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
              r={2.5}
              fill="rgba(215,25,32,0.65)"
              initial={{ r: 0 }}
              whileInView={{ r: 2.5 }}
              viewport={{ once: true }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { delay: 0.8 + i * 0.04, type: 'spring', stiffness: 250 }
              }
            />
            <text
              x={node.x + 4}
              y={node.y}
              fill="rgba(248,250,252,0.38)"
              fontSize="6"
              fontFamily="ui-monospace, monospace"
              dominantBaseline="middle"
            >
              {node.id}
            </text>
          </g>
        )
      )}

      {/* Moving convoy dot: ES → FR → DE */}
      {!reduced && (
        <motion.circle
          r={1.8}
          fill="#D71920"
          cx={80}
          cy={162}
          animate={{
            cx: [80, 138, 198],
            cy: [162, 138, 100],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'linear',
            delay: 3,
          }}
        />
      )}
    </svg>
  )
}
