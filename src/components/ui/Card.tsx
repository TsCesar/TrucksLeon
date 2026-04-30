import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
}

export function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-graphite border border-white/5 overflow-hidden',
        hover && 'transition-all duration-300 hover:border-red-accent/30 hover:shadow-[0_0_30px_rgba(215,25,32,0.1)] hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
