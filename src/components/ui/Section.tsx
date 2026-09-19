import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

/**
 * Section tones drive the vertical rhythm of the site. Alternate them so the
 * page never reads as one flat sheet of white:
 *   surface → mist → surface → red → surface …
 */
export type SectionTone = 'surface' | 'canvas' | 'mist' | 'red'

const toneClasses: Record<SectionTone, string> = {
  surface: 'bg-surface',
  canvas:  'bg-canvas',
  mist:    'bg-mist',
  // Technical red band: a whisper of brand colour over the page ground
  red:     'bg-canvas relative before:absolute before:inset-0 before:bg-[rgb(var(--c-red-accent)/0.025)] before:pointer-events-none',
}

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: SectionTone
  id?: string
}

export function Section({ tone = 'surface', className, children, id, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('py-16 md:py-24 lg:py-32', toneClasses[tone], className)}
      {...props}
    >
      {children}
    </section>
  )
}

type SectionHeaderProps = {
  badge?: string
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeader({ badge, title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', centered && 'text-center')}>
      {badge && (
        <span
          className={cn(
            'inline-flex items-center gap-2 text-red-text font-mono text-xs font-semibold tracking-[0.18em] uppercase mb-4',
            centered && 'justify-center'
          )}
        >
          <span className="w-5 h-px bg-red-accent/60" aria-hidden />
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-ink mb-4 tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-steel text-lg max-w-2xl leading-relaxed', centered && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
