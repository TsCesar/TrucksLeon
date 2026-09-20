import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'

type PageHeroProps = {
  badge: string
  title: string
  subtitle?: string
  children?: ReactNode
}

/**
 * Interior-page hero. Light, layered, quiet: a white-to-mist wash, a technical
 * grid, one soft red bloom and a red rule at the left edge.
 */
export function PageHero({ badge, title, subtitle, children }: PageHeroProps) {
  return (
    <div className="relative py-20 md:py-28 overflow-hidden border-b border-line/[0.07] bg-gradient-to-b from-surface via-surface to-canvas">
      <div className="absolute inset-0 tech-grid opacity-70" aria-hidden />

      {/* Bloom as a gradient, not a 130px blur filter — same falloff, no repaint cost */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 520px 330px at 6% 0%, rgb(215 25 32 / 0.075) 0%, rgb(215 25 32 / 0.03) 45%, transparent 75%)',
        }}
        aria-hidden
      />

      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-accent/70 to-transparent"
        aria-hidden
      />

      {/* This block is the LCP element on every interior page, so it uses the
          same CSS-only entry as the home hero. Wrapping it in <Reveal> meant
          shipping opacity:0 + blur(10px) in the HTML and waiting for Motion to
          hydrate before any of it was readable. */}
      <Container className="relative">
        <span className="hero-rise inline-flex items-center gap-2 text-red-text font-mono text-xs font-semibold tracking-[0.18em] uppercase mb-4">
          <span className="w-5 h-px bg-red-accent/60" aria-hidden />
          {badge}
        </span>
        <h1 className="hero-rise hero-rise-1 text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-ink mb-4 leading-[1.06] tracking-tight max-w-3xl text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="hero-rise hero-rise-2 text-steel text-lg md:text-xl max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </Container>
    </div>
  )
}
