import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type SectionProps = HTMLAttributes<HTMLElement> & {
  dark?: boolean
  id?: string
}

export function Section({ dark, className, children, id, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24 lg:py-32',
        dark ? 'bg-carbon' : 'bg-graphite',
        className
      )}
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
  light?: boolean
}

export function SectionHeader({ badge, title, subtitle, centered = true, light }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', centered && 'text-center')}>
      {badge && (
        <span className="inline-block text-red-accent font-mono text-xs font-semibold tracking-widest uppercase mb-4">
          {badge}
        </span>
      )}
      <h2 className={cn('text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4', light ? 'text-off-white' : 'text-off-white')}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-steel text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
