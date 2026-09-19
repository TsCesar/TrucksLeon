# Europe Map Image Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-drawn SVG landmass in EuropeRouteMap with the real PNG image `MapaEuropa.png` (1448×1086), overlaying the animated route lines and country nodes as an absolute SVG, with theme-aware CSS filters for seamless dark/light integration.

**Architecture:** Keep `EuropeRouteMap.tsx` as a single client component. Add a `div` with `position: relative` and `aspect-ratio: 1448/1086` containing three layers stacked absolutely: (1) `next/image` PNG base, (2) gradient overlay div, (3) SVG with routes and nodes. Remove all SVG land-mass paths (`EUROPE_MAIN`, `ITALY_PATH`, `UK_PATH`, `IRELAND_PATH`). Move node coordinates to 1448×1086 space. Add `.europe-map-img` and `.europe-map-overlay` CSS classes in `globals.css` for theme-aware treatment.

**Tech Stack:** Next.js `next/image` (fill mode), motion/react (existing), Tailwind CSS custom classes, `[data-theme='light']` CSS selector pattern already in use in the codebase.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `src/components/animations/EuropeRouteMap.tsx` | Rewrite | Replace SVG land paths with Image+SVG-overlay architecture; recalibrate node positions to 1448×1086 space |
| `src/app/globals.css` | Modify | Add `.europe-map-img` and `.europe-map-overlay` CSS classes with dark/light filter variants |
| `src/components/sections/EuropePreview.tsx` | Minimal check | Container already has `overflow-hidden`; no structural change needed |

---

## Task 1: Add theme-aware CSS classes to globals.css

**Files:**
- Modify: `src/app/globals.css` (add after the `[data-theme='light']` block, before `@media prefers-reduced-motion`)

- [ ] **Step 1: Add image and overlay CSS classes**

Open `src/app/globals.css` and insert the following block **after line 140** (after the closing `}` of the `[data-theme='light']` block) and **before line 142** (`/* ─── REDUCED MOTION`):

```css
/* ─── EUROPE MAP IMAGE TREATMENT ────────────────────────────────────── */
/*
  Dark mode (default): desaturate + darken so the PNG blends with the
  near-black page background and white ocean areas don't glow.
*/
.europe-map-img {
  filter: grayscale(0.85) brightness(0.38) contrast(1.25) saturate(0.4);
  transition: filter 0.25s ease;
}

/*
  Light mode: less desaturation, natural brightness, subtle muting.
*/
[data-theme='light'] .europe-map-img {
  filter: grayscale(0.45) brightness(0.78) contrast(1.05) saturate(0.65);
}

/*
  Dark overlay gradient: red hub glow on Spain side + dark vignette.
*/
.europe-map-overlay {
  background:
    radial-gradient(ellipse 30% 25% at 17% 80%, rgba(215,25,32,0.08) 0%, transparent 100%),
    linear-gradient(150deg, rgba(8,10,13,0.25) 0%, transparent 55%, rgba(8,10,13,0.15) 100%);
}

[data-theme='light'] .europe-map-overlay {
  background:
    radial-gradient(ellipse 30% 25% at 17% 80%, rgba(215,25,32,0.06) 0%, transparent 100%),
    linear-gradient(150deg, rgba(240,242,245,0.15) 0%, transparent 55%);
}
```

- [ ] **Step 2: Verify globals.css is valid**

Run:
```bash
npm run build 2>&1 | head -20
```
Expected: no CSS parse errors. If the build errors on CSS, recheck the insertion point — no mismatched braces.

---

## Task 2: Rewrite EuropeRouteMap.tsx

**Files:**
- Modify: `src/components/animations/EuropeRouteMap.tsx` (full rewrite)

**Node coordinate rationale (1448×1086 space):**
Estimated from an equirectangular projection with bounds W≈-12°, E≈35°, N≈72°, S≈30°. These are intentional approximations — expect minor visual tuning after visual inspection. Comment in code shows the geographic basis.

```
lon_px = ((lon + 12) / 47) * 1448
lat_px = ((72 - lat) / 42) * 1086

PT Lisbon  (-9°, 38.7°):  x=92,  y=860
ES Madrid  (-4°, 40.4°):  x=246, y=826
FR Paris   ( 2°, 48.9°):  x=431, y=600
GB London  ( 0°, 51.5°):  x=369, y=533
NL Amst    ( 4.9°,52.4°): x=524, y=512
BE Bruss   ( 4.4°,50.8°): x=507, y=553
DE Berlin  (13.4°,52.5°): x=771, y=508
IT Rome    (12.5°,41.9°): x=749, y=778
CH Bern    ( 7.4°,46.9°): x=589, y=651
AT Vienna  (16.4°,48.2°): x=875, y=612
CZ Prague  (14.5°,50.1°): x=815, y=570
PL Warsaw  (21.0°,52.2°): x=1013,y=518
DK Copen   (12.6°,55.7°): x=755, y=420
SE Stockh  (18.1°,59.3°): x=924, y=330
```

- [ ] **Step 3: Write the new EuropeRouteMap.tsx**

Replace the entire file with:

```tsx
'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'

type MapNode = { id: string; x: number; y: number; hub?: boolean }

// Coordinates are in the 1448×1086 image space.
// Estimated from equirectangular projection: W=-12°, E=35°, N=72°, S=30°.
// Adjust x/y values here if nodes appear offset on the actual image.
const NODES: MapNode[] = [
  { id: 'ES', x: 246,  y: 826,  hub: true },
  { id: 'PT', x: 92,   y: 860  },
  { id: 'FR', x: 431,  y: 600  },
  { id: 'GB', x: 369,  y: 533  },
  { id: 'NL', x: 524,  y: 512  },
  { id: 'BE', x: 507,  y: 553  },
  { id: 'DE', x: 771,  y: 508  },
  { id: 'IT', x: 749,  y: 778  },
  { id: 'CH', x: 589,  y: 651  },
  { id: 'AT', x: 875,  y: 612  },
  { id: 'CZ', x: 815,  y: 570  },
  { id: 'PL', x: 1013, y: 518  },
  { id: 'DK', x: 755,  y: 420  },
  { id: 'SE', x: 924,  y: 330  },
]

const ROUTES: [string, string][] = [
  ['PT', 'ES'],
  ['ES', 'FR'],
  ['FR', 'GB'],
  ['FR', 'BE'],
  ['BE', 'NL'],
  ['BE', 'DE'],
  ['DE', 'DK'],
  ['DK', 'SE'],
  ['DE', 'CZ'],
  ['CZ', 'PL'],
  ['DE', 'AT'],
  ['AT', 'CH'],
  ['CH', 'IT'],
  ['FR', 'IT'],
]

const nodeMap = new Map(NODES.map((n) => [n.id, n]))

// Mobile-visible subset: hide labels for dense nodes; keep main hubs + borders
const MOBILE_HIDDEN_LABELS = new Set(['BE', 'LU', 'CH', 'AT', 'CZ'])

export function EuropeRouteMap() {
  const reduced = useReducedMotion()

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: '1448 / 1086' }}
      aria-hidden="true"
    >
      {/* ── BASE IMAGE ── */}
      <Image
        src="/images/Europe/MapaEuropa.png"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="europe-map-img object-cover"
        priority={false}
      />

      {/* ── GRADIENT OVERLAY (theme-aware, no checkerboard) ── */}
      <div className="absolute inset-0 europe-map-overlay pointer-events-none rounded-xl" />

      {/* ── SVG ROUTES + NODES ── */}
      <svg
        viewBox="0 0 1448 1086"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D71920" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D71920" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── ROUTE LINES ── */}
        {ROUTES.map(([fromId, toId], i) => {
          const from = nodeMap.get(fromId)
          const to = nodeMap.get(toId)
          if (!from || !to) return null
          const mx = (from.x + to.x) / 2
          const my = (from.y + to.y) / 2 - 30
          return (
            <motion.path
              key={`${fromId}-${toId}`}
              d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
              stroke="rgba(215,25,32,0.55)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 10"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      pathLength: { duration: 1.4, delay: 0.5 + i * 0.07, ease: 'easeOut' },
                      opacity: { duration: 0.3, delay: 0.5 + i * 0.07 },
                    }
              }
            />
          )
        })}

        {/* ── COUNTRY NODES ── */}
        {NODES.map((node, i) =>
          node.hub ? (
            <g key={node.id}>
              {/* Glow halo */}
              <circle cx={node.x} cy={node.y} r={80} fill="url(#hub-glow)" />
              {/* Pulse rings */}
              <motion.circle
                cx={node.x} cy={node.y} r={20}
                fill="transparent" stroke="#D71920" strokeWidth="2"
                animate={reduced ? {} : { r: [20, 70], opacity: [0.7, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 1.8 }}
              />
              <motion.circle
                cx={node.x} cy={node.y} r={14}
                fill="transparent" stroke="#D71920" strokeWidth="1.5"
                animate={reduced ? {} : { r: [14, 50], opacity: [0.5, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 2.4 }}
              />
              {/* Core dot */}
              <motion.circle
                cx={node.x} cy={node.y} r={14} fill="#D71920"
                initial={{ r: 0 }}
                whileInView={{ r: 14 }}
                viewport={{ once: true }}
                transition={reduced ? { duration: 0 } : { delay: 0.5, type: 'spring', stiffness: 260 }}
              />
              <text
                x={node.x + 20} y={node.y + 2}
                fill="#D71920" fontSize="22"
                fontFamily="ui-monospace, monospace" fontWeight="bold"
                dominantBaseline="middle"
              >
                {node.id}
              </text>
            </g>
          ) : (
            <g key={node.id}>
              <motion.circle
                cx={node.x} cy={node.y} r={9}
                fill="rgba(215,25,32,0.8)"
                initial={{ r: 0, opacity: 0 }}
                whileInView={{ r: 9, opacity: 1 }}
                viewport={{ once: true }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { delay: 1.0 + i * 0.05, type: 'spring', stiffness: 280 }
                }
              />
              <text
                x={node.x + 14} y={node.y}
                fill="rgba(248,250,252,0.7)" fontSize="18"
                fontFamily="ui-monospace, monospace"
                dominantBaseline="middle"
                className={MOBILE_HIDDEN_LABELS.has(node.id) ? 'hidden sm:block' : undefined}
              >
                {node.id}
              </text>
            </g>
          )
        )}

        {/* ── MOVING CONVOY DOT: ES → FR → DE → PL ── */}
        {!reduced && (
          <motion.circle
            r={7} fill="#D71920"
            cx={246} cy={826}
            animate={{
              cx: [246, 431, 771, 1013],
              cy: [826, 600, 508, 518],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'linear',
              delay: 2,
            }}
          />
        )}
      </svg>
    </div>
  )
}
```

- [ ] **Step 4: TypeScript check**

Run:
```bash
npx tsc --noEmit 2>&1 | head -30
```
Expected: zero errors for the modified files. The only likely issue is if `motion/react` types complain about `className` on `text` SVG elements — if so, cast the className as `{ className?: string }` or remove the `className` from the SVG `text` element and handle mobile label hiding differently (see Step 5 fallback).

- [ ] **Step 5: Mobile label fallback (if SVG text className doesn't work)**

SVG `<text>` elements don't respect Tailwind `hidden sm:block`. If TypeScript or the browser ignores it, replace the problematic text element with a conditional render:

```tsx
{!MOBILE_HIDDEN_LABELS.has(node.id) && (
  <text
    x={node.x + 14} y={node.y}
    fill="rgba(248,250,252,0.7)" fontSize="18"
    fontFamily="ui-monospace, monospace"
    dominantBaseline="middle"
  >
    {node.id}
  </text>
)}
```

This simply omits dense-area labels entirely (they're not critical on mobile).

---

## Task 3: Verify EuropePreview.tsx container

**Files:**
- Read (no edit expected): `src/components/sections/EuropePreview.tsx`

- [ ] **Step 6: Confirm container is compatible**

The container in `EuropePreview.tsx` at line 72 wraps `<EuropeRouteMap />` with:
```tsx
<div className="relative p-6 rounded-2xl bg-graphite/40 border border-white/5 ...">
```

The `relative` class and `overflow-hidden` on the `<Section>` (line 22) are compatible with the new component. No changes needed — the inner component now manages its own `relative` root with `aspect-ratio`.

However: the `p-6` padding means the map has inset spacing inside the card. This is fine for premium feel. If the user wants the image to bleed to the card edges, remove `p-6` from the wrapping div and add `overflow-hidden` to it. Leave as-is for now.

---

## Task 4: Run lint + build verification

**Files:** (no changes, verification only)

- [ ] **Step 7: Run ESLint**

```bash
npm run lint 2>&1
```
Expected: 0 errors, 0 warnings. Common issue: `next/image` `alt=""` with empty string is intentional (decorative image) — ESLint may flag it. If it does, add a comment:

```tsx
{/* decorative — aria-hidden on parent, empty alt is correct */}
<Image alt="" ... />
```

Or suppress: `// eslint-disable-next-line jsx-a11y/alt-text` — but prefer the comment approach.

- [ ] **Step 8: Run production build**

```bash
npm run build 2>&1 | tail -30
```
Expected: `✓ Compiled successfully` with no errors. The image file `public/images/Europe/MapaEuropa.png` must be present for `next/image` to serve it — it is, per the file listing.

- [ ] **Step 9: Dev server smoke test**

```bash
npm run dev
```
Open in browser:
1. `/es` — map section visible mid-page, image renders (no white square), routes animate in
2. `/en` — same check with English locale
3. Toggle dark/light theme — image filter transitions, no flash
4. Resize to 360px width — map proportional, no horizontal overflow

If nodes appear noticeably offset from countries (e.g., ES dot lands in the ocean), adjust the `x`/`y` values in the `NODES` array. The coordinate comment in the file explains the math for recalibration.

---

## Coordinate Tuning Reference

If nodes are off, use this formula to recalculate any country's position in the 1448×1086 SVG space:

```
x = ((longitude_degrees + 12) / 47) * 1448
y = ((72 - latitude_degrees)  / 42) * 1086
```

Projection bounds assumed: W=-12°, E=35°, N=72°, S=30°.

If the actual image uses different bounds (check how much ocean shows left/right/top/bottom), adjust the divisors and offsets accordingly.

---

## Self-Review Checklist

- [x] TAREA 1 (use new image): Task 2 uses `next/image` with `MapaEuropa.png`
- [x] TAREA 2 (adapt routes to new image): Nodes recalibrated to 1448×1086, SVG overlays image
- [x] TAREA 3 (premium integration): Overlay gradient, card container, glow on ES hub
- [x] TAREA 4 (responsive): `aspect-ratio` + `w-full` auto-scales; mobile label hiding in Task 2
- [x] TAREA 5 (dark/light): Task 1 adds `.europe-map-img` with `[data-theme='light']` override
- [x] TAREA 6 (build + test): Tasks 4 Steps 7–9 cover lint, build, and dev smoke test
- [x] No white square: `object-cover` + CSS filter darkens background; overlay hides seams
- [x] No backward-compat cruft: SVG land paths fully removed, not kept behind a flag
- [x] Multidioma: `EuropeRouteMap` is purely visual, no text strings — no i18n impact
- [x] Convoi animation: kept, coordinates updated to new space
- [x] `prefers-reduced-motion`: all animations gated on `!reduced` / `reduced ? {duration:0}`
