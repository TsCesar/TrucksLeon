import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
}

export function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface border border-line/[0.09] shadow-card overflow-hidden',
        hover &&
          'transition-all duration-300 ease-out-expo hover:border-red-accent/30 hover:shadow-lift hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
