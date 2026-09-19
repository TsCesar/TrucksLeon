import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
            {props.required && <span className="text-red-text ml-1" aria-hidden>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-raised border border-line/12 text-ink placeholder:text-steel/70',
            'transition-[border-color,box-shadow,background-color] duration-200',
            'hover:border-line/20',
            'focus:outline-none focus:bg-surface focus:border-red-accent/70 focus:shadow-[0_0_0_3px_rgb(215_25_32_/_0.10)]',
            error && 'border-red-accent/60 bg-red-accent/[0.03] focus:border-red-accent',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-steel">{helperText}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-text font-medium">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
