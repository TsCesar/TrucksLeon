import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'red' | 'steel' | 'outline'
}

const variantClasses = {
  red:     'bg-red-accent/[0.07] text-red-text border border-red-accent/20',
  steel:   'bg-line/[0.04] text-steel border border-line/10',
  outline: 'bg-surface/70 text-ink border border-line/14 backdrop-blur-sm',
}

export function Badge({ variant = 'red', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
