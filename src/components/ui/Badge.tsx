import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'red' | 'steel' | 'outline'
}

const variantClasses = {
  red: 'bg-red-accent/10 text-red-accent border border-red-accent/20',
  steel: 'bg-white/5 text-steel border border-white/10',
  outline: 'bg-transparent text-off-white border border-white/20',
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
