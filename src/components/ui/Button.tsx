'use client'

import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-red-accent text-white shadow-red hover:bg-red-dark hover:shadow-[0_12px_28px_-12px_rgb(215_25_32_/_0.55)] hover:-translate-y-px active:translate-y-0 active:scale-[0.985]',
  secondary:
    'bg-surface text-ink border border-line/12 shadow-card hover:border-red-accent/35 hover:text-red-text hover:shadow-lift hover:-translate-y-px active:translate-y-0 active:scale-[0.985]',
  ghost:
    'bg-transparent text-ink hover:bg-line/[0.05] active:scale-[0.985]',
  outline:
    'bg-transparent border border-red-accent/55 text-red-text hover:bg-red-accent hover:border-red-accent hover:text-white active:scale-[0.985]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg min-h-[38px]',
  md: 'px-6 py-3 text-base rounded-lg min-h-[46px]',
  lg: 'px-8 py-4 text-lg rounded-xl min-h-[54px]',
}

// Ripple tint: white on the solid red button, red on light surfaces.
const rippleTint: Record<Variant, string> = {
  primary:   'rgba(255,255,255,0.28)',
  secondary: 'rgba(215,25,32,0.12)',
  ghost:     'rgba(215,25,32,0.10)',
  outline:   'rgba(215,25,32,0.14)',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, onPointerDown, ...props }, ref) => {

    function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
      onPointerDown?.(e)
      if (disabled || loading) return

      const btn = e.currentTarget
      const rect = btn.getBoundingClientRect()
      const diameter = Math.max(rect.width, rect.height) * 2
      const x = e.clientX - rect.left - diameter / 2
      const y = e.clientY - rect.top - diameter / 2

      const ripple = document.createElement('span')
      Object.assign(ripple.style, {
        position: 'absolute',
        width: `${diameter}px`,
        height: `${diameter}px`,
        left: `${x}px`,
        top: `${y}px`,
        borderRadius: '50%',
        background: rippleTint[variant],
        transform: 'scale(0)',
        animation: 'btn-ripple 0.5s ease-out forwards',
        pointerEvents: 'none',
      })
      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 500)
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        onPointerDown={handlePointerDown}
        className={cn(
          'relative overflow-hidden inline-flex items-center justify-center gap-2 font-heading font-semibold',
          'transition-all duration-200 ease-out-expo',
          'focus-visible:ring-2 focus-visible:ring-red-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:translate-y-0',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
