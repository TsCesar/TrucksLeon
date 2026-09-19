# TrucksLeón Polish — Map, i18n, Logo, Performance, Animations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Europe map coordinate misalignment, boost logo/header luminosity, resolve i18n edge-case in LanguageSwitcher, strip expensive blur animations from scroll reveals, and polish hover/reveal animations across sections.

**Architecture:** Six focused surgical edits — each touches one file or one concern. No new dependencies. No new components. All performance wins come from removing or simplifying existing code, not adding abstraction.

**Tech Stack:** Next.js 15 App Router, next-intl, motion/react, Tailwind CSS v4, CSS custom properties.

---

## Pre-flight: what is actually broken

| Issue | Root cause | File |
|---|---|---|
| Map dots misaligned | y-coords were calibrated from ES/PT but scale breaks for central/northern Europe (DE, NL, CZ, SE, PL are ~8-10 units too far north; several x-coords 3-5 units too far east) | `EuropeRouteMap.tsx` |
| Logo dim | Glow opacity values are too conservative (14%/18%) | `Header.tsx` |
| i18n stale on switch | `router.refresh()` after `router.push()` causes a race: the refresh re-fetches the old layout before the push resolves; page briefly shows stale locale | `LanguageSwitcher.tsx` |
| `<html lang>` always "es" | Hardcoded in root layout, locale layout doesn't set it | `layout.tsx` (locale) |
| Scroll reveal sluggish | `filter: blur(10px)` initial state in Reveal + StaggerItem triggers GPU re-raster on every scroll event; runs on every intersection | `Reveal.tsx`, `Stagger.tsx` |
| Hero bg scale loop | `scale: [1,1.04,1]` on hero background image runs every 22 s, keeps compositing active | `HeroBase.tsx` |

---

## Task 1: Fix EuropeRouteMap coordinates

**Calibration method:** ES, PT, and GB are confirmed visually correct. Use them as anchors:
- Anchor A: ES (lon=-3.7°, lat=40.4°) → (x=20, y=62)
- Anchor B: PT (lon=-8°, lat=39.5°) → (x=12, y=64) confirms x-scale = 1.86 units/°lon
- Anchor C: GB (lon=-2°, lat=54°) → (x=23, y=33) confirms y-scale = 2.13 units/°lat

Formula:
```
x = 20 + (lon - (-3.7)) × 1.86
y = 62 - (lat - 40.4) × 2.13
```

**Files:**
- Modify: `src/components/animations/EuropeRouteMap.tsx`

- [ ] **Step 1: Replace the NODES array**

In `EuropeRouteMap.tsx`, replace lines 27-47 (the entire `NODES` array) with:

```tsx
const NODES: MapNode[] = [
  // ── Iberian Peninsula ──────────────────────────────────────────────
  { id: 'ES', x: 20,  y: 62,  hub: true, lx: 3,     ly: 0    },
  { id: 'PT', x: 12,  y: 64,             lx: -5.5,   ly: -1   },
  // ── Western / Northern Europe ──────────────────────────────────────
  { id: 'FR', x: 31,  y: 50,             lx: -5.5,   ly: -1.5 },
  { id: 'GB', x: 23,  y: 33,             lx: 2,      ly: 0    },
  { id: 'NL', x: 37,  y: 36,             lx: 2,      ly: 0,   hideLabelMobile: true },
  { id: 'BE', x: 35,  y: 41,             lx: 2,      ly: 0,   hideLabelMobile: true },
  // ── Central Europe ─────────────────────────────────────────────────
  { id: 'DE', x: 46,  y: 39,             lx: 2,      ly: 0    },
  { id: 'CH', x: 42,  y: 48,             lx: 2,      ly: 0,   hideLabelMobile: true },
  { id: 'AT', x: 54,  y: 46,             lx: 2,      ly: 0,   hideLabelMobile: true },
  { id: 'CZ', x: 56,  y: 42,             lx: 2,      ly: 0,   hideLabelMobile: true },
  // ── Southern Europe ────────────────────────────────────────────────
  { id: 'IT', x: 50,  y: 59,             lx: 2,      ly: 0    },
  // ── Northern / Eastern Europe ──────────────────────────────────────
  { id: 'DK', x: 46,  y: 28,             lx: 2,      ly: 0    },
  { id: 'SE', x: 60,  y: 15,             lx: 2,      ly: 0    },
  { id: 'PL', x: 64,  y: 38,             lx: 2,      ly: 0    },
]
```

- [ ] **Step 2: Update the moving convoy animation** to use updated ES→FR→DE→PL coordinates

In `EuropeRouteMap.tsx`, replace the `<motion.circle>` convoy block (lines ~222-239):

```tsx
{!reduced && (
  <motion.circle
    r={1.6} fill="#D71920"
    cx={20} cy={62}
    animate={{
      cx: [20, 31, 46, 64],
      cy: [62, 50, 39, 38],
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
```

- [ ] **Step 3: Verify visually** — run `npm run dev`, open `/es`, scroll to the Europa section. Confirm:
  - ES dot is in Iberian Peninsula (lower-left area of map)
  - DE dot is clearly in central Germany (not up by Denmark)
  - SE dot is in Scandinavia (upper right)
  - PL dot is east of DE, not overlapping it
  - Routes connect dots correctly without floating lines

- [ ] **Step 4: Commit**

```bash
git add src/components/animations/EuropeRouteMap.tsx
git commit -m "fix: recalibrate EuropeRouteMap node coordinates to geographic anchors"
```

---

## Task 2: Boost logo/header luminosity

**Files:**
- Modify: `src/components/layout/Header.tsx` (lines 52-64)

- [ ] **Step 1: Strengthen logo glow and ring**

In `Header.tsx`, replace the logo wrapper `div` className and style (lines 52-65):

```tsx
<div className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300
  ring-1 ring-red-accent/40
  bg-gradient-to-r from-red-accent/[0.12] to-transparent
  shadow-[0_0_28px_rgba(215,25,32,0.22),inset_0_1px_0_rgba(215,25,32,0.20)]
  hover:ring-red-accent/55 hover:shadow-[0_0_40px_rgba(215,25,32,0.34),inset_0_1px_0_rgba(215,25,32,0.28)]">
  <Image
    src="/images/brand/logo-trucksleon.png"
    alt={t('aria.logoAlt')}
    width={180}
    height={54}
    className="h-11 lg:h-13 w-auto object-contain"
    style={{ filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.85)) drop-shadow(0 0 22px rgba(215,25,32,0.35))' }}
    priority
  />
</div>
```

Changes vs original:
- `ring-red-accent/20` → `/40`
- `from-red-accent/[0.08]` → `/[0.12]`
- `shadow-[0_0_18px_rgba(215,25,32,0.14)...]` → `0_0_28px_0.22`
- hover shadow `0.22` → `0.34`
- drop-shadow filter `0.18` → `0.35`, distance `14px` → `22px`

- [ ] **Step 2: Verify in both themes**

Run `npm run dev`, toggle between dark and light mode. In dark mode the logo should have a visible red ambient glow. In light mode the glow should still be present but not garish (the opacity values are still modest).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: increase logo glow strength for better header presence"
```

---

## Task 3: Fix i18n — locale switch race + html lang

**Root cause 1:** `router.refresh()` in `LanguageSwitcher.switchLocale` fires a server re-render request simultaneously with `router.push()`. The refresh can resolve before the push, causing the page to briefly flash with the old locale's content.

**Root cause 2:** `<html lang="es">` in `app/layout.tsx` is hardcoded. Browsers and screen readers use this to determine language for spell-check, hyphenation, TTS, etc. It should reflect the active locale.

**Files:**
- Modify: `src/components/layout/LanguageSwitcher.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Remove `router.refresh()` from LanguageSwitcher**

In `LanguageSwitcher.tsx`, in the `switchLocale` function (lines 35-52), remove the `router.refresh()` call:

```tsx
function switchLocale(newLocale: Locale) {
  if (newLocale === activeLocale) { setOpen(false); return }
  const segments = pathname.split('/')
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = newLocale
  } else if (segments[1] === '') {
    segments.splice(1, 0, newLocale)
  } else {
    segments.splice(1, 0, newLocale)
  }
  const newPath = segments.join('/') || '/'
  const query = typeof window !== 'undefined' ? window.location.search : ''
  router.push(newPath + query)
  setOpen(false)
}
```

- [ ] **Step 2: Set `lang` attribute dynamically in locale layout**

In `src/app/[locale]/layout.tsx`, the locale layout currently returns a fragment wrapping `NextIntlClientProvider`. Next.js App Router allows nested layouts to pass props to parent segments via `generateStaticParams` but NOT to `<html>`. The correct fix is to set it server-side via a workaround: pass the locale as a `lang` attribute on the `<body>` wrapper, OR — simpler and correct — set it on a client-side `useEffect` in the existing `ThemeProvider`.

Open `src/components/providers/ThemeProvider.tsx` and read its current content to know what's there before editing:

```bash
cat src/components/providers/ThemeProvider.tsx
```

Then add a `useEffect` that syncs `document.documentElement.lang` to the current locale on the client. The locale is available from `useLocale()`:

In `ThemeProvider.tsx`, add after the existing theme effect:

```tsx
// Sync html lang attribute to active locale
const locale = useLocale()
useEffect(() => {
  document.documentElement.lang = locale
}, [locale])
```

This runs once per navigation and keeps `<html lang>` in sync with the active locale without requiring changes to the root layout structure.

- [ ] **Step 3: Read ThemeProvider before editing**

```bash
cat src/components/providers/ThemeProvider.tsx
```

Confirm the file exports a `ThemeProvider` client component. Add the two lines above to the component body (after existing state/effects, before the return).

Import `useLocale` at the top:
```tsx
import { useLocale } from 'next-intl'
```

- [ ] **Step 4: Audit locale files for missing keys**

Run the following to spot missing keys:
```bash
node -e "
const fs = require('fs');
const locales = ['es','en','nl','de','fr'];
const base = JSON.parse(fs.readFileSync('src/messages/es.json','utf8'));
function flatKeys(obj, prefix='') {
  return Object.entries(obj).flatMap(([k,v]) =>
    typeof v === 'object' ? flatKeys(v, prefix+k+'.') : [prefix+k]
  );
}
const baseKeys = flatKeys(base);
for (const loc of locales.filter(l => l !== 'es')) {
  const msg = JSON.parse(fs.readFileSync(\`src/messages/\${loc}.json\`,'utf8'));
  const msgKeys = new Set(flatKeys(msg));
  const missing = baseKeys.filter(k => !msgKeys.has(k));
  if (missing.length) console.log(\`\${loc}: MISSING \${missing.join(', ')}\`);
}
"
```

For each missing key, add it to the relevant locale file with an appropriate translation (or copy the ES value as placeholder and translate it).

- [ ] **Step 5: Verify locale switching**

Run `npm run dev`. Navigate to `/es`. Switch to English via the language selector. Confirm:
- Header nav shows "Home", "About Us", "Services", etc. (not Spanish)
- The selector immediately shows "EN" with no flash back to ES
- `document.documentElement.lang` in browser devtools shows "en"

Navigate to `/de`, `/fr`, `/nl` and verify the same.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/LanguageSwitcher.tsx src/components/providers/ThemeProvider.tsx src/messages/
git commit -m "fix: remove router.refresh race in locale switch, sync html lang attribute"
```

---

## Task 4: Performance — remove blur from scroll animations

**Why:** `filter: blur(Npx)` on animated elements forces the browser to create a new GPU stacking context for each intersecting element. When multiple `Reveal`/`StaggerItem` components enter the viewport simultaneously (e.g., a grid of 6 service cards), the browser rasterizes 6+ blur layers per frame. On mid-range mobile this causes visible jank. The visual difference between blur-reveal and plain fade+slide is imperceptible at scroll speed.

**Files:**
- Modify: `src/components/animations/Reveal.tsx`
- Modify: `src/components/animations/Stagger.tsx`
- Modify: `src/components/sections/HeroBase.tsx`

- [ ] **Step 1: Remove blur from Reveal initial state**

In `src/components/animations/Reveal.tsx`, replace the `makeVariants` function (lines 18-32):

```tsx
function makeVariants(direction: Direction): Variants {
  type HiddenState = { opacity: number; y?: number; x?: number; scale?: number }
  const offsets: Record<Direction, HiddenState> = {
    up:    { opacity: 0, y: 32, scale: 0.97 },
    down:  { opacity: 0, y: -32, scale: 0.97 },
    left:  { opacity: 0, x: -36 },
    right: { opacity: 0, x: 36 },
    none:  { opacity: 0, scale: 0.98 },
  }
  return {
    hidden: offsets[direction],
    visible: { opacity: 1, y: 0, x: 0, scale: 1 },
  }
}
```

Also update the `Reveal` component signature — remove `blur` prop since it no longer exists:

```tsx
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  className,
  once = true,
}: Omit<RevealProps, 'blur'>) {
```

And update the `makeVariants` call:
```tsx
variants={makeVariants(direction)}
```

- [ ] **Step 2: Remove blur from StaggerItem**

In `src/components/animations/Stagger.tsx`, replace the `StaggerItem` variants (lines 41-54):

```tsx
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Remove hero background scale loop**

In `src/components/sections/HeroBase.tsx`, the inner `motion.div` with `animate={{ scale: [1, 1.04, 1] }}` (lines 55-69) keeps the compositor busy. Replace that inner motion.div with a plain div:

```tsx
<div className="absolute inset-0">
  <Image
    src="/images/hero/hero-truck-main.png"
    alt=""
    fill
    priority
    className="object-cover"
    style={{ objectPosition: '68% 50%', opacity: 0.32 }}
    sizes="130vw"
  />
</div>
```

The outer parallax div with `style={{ y: bgY }}` stays — parallax scroll is scroll-linked (not time-looped) so it doesn't keep the GPU busy at idle.

- [ ] **Step 4: Remove `blur` prop from any call-sites**

Search for any component passing `blur` prop to `<Reveal>`:

```bash
grep -r 'blur=' src/components/sections/ src/app/
```

If any results exist, remove the `blur={...}` prop from each call-site. The `blur` prop was optional with default `true`, so removing it won't break anything — the new component just ignores it.

- [ ] **Step 5: Run dev and check scroll smoothness**

`npm run dev`, scroll through all sections on a mobile viewport (Chrome DevTools at 390px). Verify no layout jank in the "Servicios", "Vehículos", and "Entregados" sections when items reveal.

- [ ] **Step 6: Commit**

```bash
git add src/components/animations/Reveal.tsx src/components/animations/Stagger.tsx src/components/sections/HeroBase.tsx
git commit -m "perf: remove blur filter from scroll reveal animations, remove hero bg scale loop"
```

---

## Task 5: Animation polish — hover states and section reveals

**Goal:** Make the site feel more alive without adding lag. Target: service cards, vehicle category cards, delivered cards, and the hero CTA buttons.

**Files:**
- Modify: `src/components/sections/ServicesPreview.tsx`
- Modify: `src/components/sections/VehicleCategoriesPreview.tsx`

- [ ] **Step 1: Read ServicesPreview to check current hover state**

```bash
cat src/components/sections/ServicesPreview.tsx
```

If service cards already have `whileHover={{ y: -4, scale: 1.02 }}` or similar, skip this step. If not, add it:

In `ServicesPreview.tsx`, find the card `motion.div` (or wrap a static div in `motion.div`) and add:
```tsx
whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
```

- [ ] **Step 2: Read VehicleCategoriesPreview**

```bash
cat src/components/sections/VehicleCategoriesPreview.tsx
```

Same audit — ensure category cards have a hover lift. If using static divs, wrap in `motion.div` with:
```tsx
whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
```

- [ ] **Step 3: Verify hero CTA button hover**

In `Button.tsx`, confirm `active:scale-[0.97]` exists (from prior session). No change needed if it does.

- [ ] **Step 4: Tighten Reveal timing**

In `Reveal.tsx`, change the default `duration` from `0.75` to `0.6` and `viewport margin` from `-80px` to `-60px`:

```tsx
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,   // was 0.75
  className,
  once = true,
}: Omit<RevealProps, 'blur'>) {
  ...
  viewport={{ once, margin: '-60px' }}  // was -80px
```

This makes reveals feel snappier and trigger slightly earlier (less of the element needs to be on screen).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ServicesPreview.tsx src/components/sections/VehicleCategoriesPreview.tsx src/components/animations/Reveal.tsx
git commit -m "feat: add hover lift to service/category cards, tighten reveal timing"
```

---

## Task 6: Dark/light theme audit + responsive check

**Files:**
- Modify: `src/app/globals.css` (if fixes needed)
- Read-only: `src/styles/tokens.css`

- [ ] **Step 1: Light mode visual audit**

Run `npm run dev`. Toggle to light mode. Check each section:
- Header: logo glow should be subtle, not blinding. If the new `/40` ring is too strong in light mode, add a light-mode override in `tokens.css`:
  ```css
  [data-theme='light'] {
    /* Already has --color-red-glow: rgba(215,25,32,0.10) */
  }
  ```
  If needed, add `europe-map-overlay` light mode style in `globals.css`.
- MouseGlow: already adapts to light mode via MutationObserver. Verify it looks neutral, not bright.
- Map: The SVG route color `rgba(215,25,32,0.55)` may look strong in light mode. If so, add a CSS variable override.

- [ ] **Step 2: Responsive audit at 360px, 390px, 768px**

In Chrome DevTools:
- 360px: Check header doesn't overflow, logo isn't clipped, mobile menu opens correctly
- 360px: Check map doesn't overflow horizontally (it uses `aspect-ratio: 1448/1086` and `w-full`)
- 768px: Check Europa section grid switches correctly between 1 and 2 columns
- Check no `overflow-x` on any page section

Fix any overflow issues found by adding `overflow-hidden` to the parent or adjusting the responsive grid.

- [ ] **Step 3: Commit any fixes**

```bash
git add -p  # stage only relevant changes
git commit -m "fix: dark/light mode + responsive audit corrections"
```

---

## Task 7: Lint + build verification

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Fix any errors (warnings are acceptable). Common issues after these changes: unused `blur` prop type, unused imports.

In `Reveal.tsx`, remove the `blur?: boolean` from `RevealProps` type if it's still there.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Note any page size regressions vs the prior build (the hero change should slightly reduce JS).

- [ ] **Step 3: Smoke test production build**

```bash
npm run start
```

Navigate to `/es`, `/en`, `/de`, `/es/europa`. Verify:
- Map dots are correctly placed
- Language switcher works without flash
- Animations are smooth
- Logo is more luminous

- [ ] **Step 4: Commit if any final lint-driven cleanups**

```bash
git add .
git commit -m "chore: lint cleanup after polish pass"
```

---

## Self-review against spec

| Requirement | Task | Status |
|---|---|---|
| Map points corrected for ES,PT,FR,GB,NL,BE,DE,DK,SE,IT,PL,CH,AT,CZ | Task 1 | Covered |
| Routes follow updated coords | Task 1 | Covered |
| Labels don't collide | Task 1 (lx/ly kept) | Covered |
| Moving convoy uses new coords | Task 1 | Covered |
| Logo more luminous with red glow | Task 2 | Covered |
| Header legibility improved | Task 2 | Covered |
| Locale switch doesn't flash old content | Task 3 | Covered |
| Nav links translate in all 5 locales | Task 3 | Covered |
| `html lang` reflects active locale | Task 3 | Covered |
| Missing translation keys patched | Task 3 step 4 | Covered |
| Reveal blur removed (perf) | Task 4 | Covered |
| Stagger blur removed (perf) | Task 4 | Covered |
| Hero bg scale loop removed (perf) | Task 4 | Covered |
| Hover lift on service/category cards | Task 5 | Covered |
| Reveal timing snappier | Task 5 | Covered |
| Dark mode audit | Task 6 | Covered |
| Light mode audit | Task 6 | Covered |
| Responsive 360/390/768 check | Task 6 | Covered |
| `npm run lint` passes | Task 7 | Covered |
| `npm run build` passes | Task 7 | Covered |

**Known limitation not in scope:** URL slugs (`/quienes-somos`, `/servicios`) are in Spanish across all locales. This is by design — next-intl pathname-based routing with locale prefix but shared slugs. Translating the slugs would require `pathnames` config in `next-intl` middleware and is a separate, larger task.
