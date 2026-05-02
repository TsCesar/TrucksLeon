import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/animations/Reveal'

type PageHeroProps = {
  badge: string
  title: string
  subtitle?: string
  children?: ReactNode
}

export function PageHero({ badge, title, subtitle, children }: PageHeroProps) {
  return (
    <div className="relative py-20 md:py-28 bg-graphite border-b border-white/8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(248,250,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="absolute top-0 left-0 w-[600px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(215,25,32,0.05)' }}
        aria-hidden
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-accent/50 to-transparent"
        aria-hidden
      />
      <Container>
        <Reveal>
          <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            {badge}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-off-white mb-4 leading-tight max-w-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-steel text-lg md:text-xl max-w-2xl leading-relaxed">{subtitle}</p>
          )}
          {children}
        </Reveal>
      </Container>
    </div>
  )
}
