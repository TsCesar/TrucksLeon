'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Image } from '@/components/ui/Image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DeliveredVehicle } from '@/data/deliveredVehicles'

type Props = {
  vehicle: DeliveredVehicle
  onClose: () => void
}

/** Everything inside the dialog that can take focus. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Minimum horizontal travel before a touch counts as a swipe, in px. */
const SWIPE_THRESHOLD = 48

/**
 * Detail view for a delivered vehicle: the photographs from its original
 * catalogue listing, plus whatever technical copy that listing carried.
 *
 * Deliberately small: a portal, a keyboard handler and an index. The gallery
 * images are only ever requested once this is open, so the listing page still
 * downloads twelve covers and nothing more.
 *
 * Modal behaviour is hand-rolled rather than pulled from a library — it is a
 * focus trap, a restore and two touch coordinates:
 *   - focus moves to the close button on open;
 *   - Tab and Shift+Tab cycle inside the dialog and cannot reach the page
 *     behind it;
 *   - focus returns to whatever opened the dialog when it closes, so keyboard
 *     users are not dropped at the top of the document;
 *   - a horizontal swipe changes photo on touch devices.
 */
export function VehicleGallery({ vehicle, onClose }: Props) {
  const t = useTranslations('gallery')
  const shots = vehicle.images?.length ? vehicle.images : vehicle.image ? [vehicle.image] : []
  const [i, setI] = useState(0)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)

  const prev = useCallback(() => setI((n) => (n - 1 + shots.length) % shots.length), [shots.length])
  const next = useCallback(() => setI((n) => (n + 1) % shots.length), [shots.length])

  useEffect(() => setMounted(true), [])

  // Remember the trigger before the dialog steals focus, and hand it back.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => opener?.focus?.()
  }, [mounted])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null
      )
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      // Wrap at both ends, and pull focus back in if it escaped the dialog.
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose, prev, next])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current
    touchStartX.current = null
    if (start === null || shots.length < 2) return
    const dx = e.changedTouches[0].clientX - start
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    if (dx < 0) next()
    else prev()
  }

  if (!mounted || shots.length === 0) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-ink/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={vehicle.name}
      /* stopPropagation is required, not defensive. A React portal still
         bubbles its events through the REACT tree, and this dialog is rendered
         from inside DeliveredVehicleCard's clickable <article>. Without it the
         backdrop click closed the gallery and the very same click then hit the
         card's open handler, so the dialog never appeared to close. */
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-xl bg-surface shadow-float"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="absolute top-3 right-3 z-10 grid place-items-center w-10 h-10 rounded-lg bg-surface/90 border border-line/10 text-ink hover:border-red-accent/40 hover:text-red-text transition-colors"
        >
          <X size={18} aria-hidden />
        </button>

        <div className="relative aspect-[16/10] bg-mist">
          <Image
            key={shots[i]}
            src={shots[i]}
            alt={`${vehicle.name} — ${t('counter', { n: i + 1, total: shots.length })}`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />

          {shots.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={t('previous')}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-lg bg-surface/90 border border-line/10 text-ink hover:border-red-accent/40 hover:text-red-text transition-colors"
              >
                <ChevronLeft size={18} aria-hidden />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t('next')}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-lg bg-surface/90 border border-line/10 text-ink hover:border-red-accent/40 hover:text-red-text transition-colors"
              >
                <ChevronRight size={18} aria-hidden />
              </button>
              <span
                className="absolute bottom-3 right-3 font-mono text-[11px] px-2 py-1 rounded bg-surface/90 border border-line/10 text-steel"
                aria-live="polite"
                aria-label={t('counter', { n: i + 1, total: shots.length })}
              >
                {i + 1}/{shots.length}
              </span>
            </>
          )}
        </div>

        {shots.length > 1 && (
          <div className="flex gap-2 overflow-x-auto p-3 border-t border-line/[0.07]">
            {shots.map((s, n) => (
              <button
                key={s}
                type="button"
                onClick={() => setI(n)}
                aria-label={t('thumb', { n: n + 1 })}
                aria-current={n === i}
                className={`relative w-20 h-14 shrink-0 rounded-md overflow-hidden border transition-colors ${
                  n === i ? 'border-red-accent' : 'border-line/10 hover:border-line/25'
                }`}
              >
                <Image src={s} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-5 sm:p-6 border-t border-line/[0.07]">
          <p className="text-xs text-red-text font-mono font-semibold uppercase tracking-[0.14em] mb-1.5">
            {vehicle.brand}
          </p>
          <h2 className="text-ink font-heading font-bold text-xl sm:text-2xl leading-snug mb-3">
            {vehicle.name}
          </h2>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {vehicle.specs && (
              <span className="text-steel text-xs font-mono px-2 py-1 rounded bg-line/[0.05]">
                {vehicle.specs}
              </span>
            )}
            {vehicle.category && (
              <span className="text-steel text-xs font-mono px-2 py-1 rounded bg-line/[0.05]">
                {vehicle.category}
              </span>
            )}
            {vehicle.year && (
              <span className="text-steel text-xs font-mono px-2 py-1 rounded bg-line/[0.05]">
                {vehicle.year}
              </span>
            )}
          </div>
          {vehicle.description && (
            <p className="text-steel text-[0.8rem] leading-relaxed font-mono">{vehicle.description}</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
