import { cn } from '@/lib/utils'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-ink">
            {label}
            {props.required && <span className="text-red-text ml-1" aria-hidden>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-raised border border-line/12 text-ink placeholder:text-steel/70',
            'transition-[border-color,box-shadow,background-color] duration-200 resize-none min-h-[120px]',
            'hover:border-line/20',
            'focus:outline-none focus:bg-surface focus:border-red-accent/70 focus:shadow-[0_0_0_3px_rgb(215_25_32_/_0.10)]',
            error && 'border-red-accent/60 bg-red-accent/[0.03] focus:border-red-accent',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} role="alert" className="text-xs text-red-text font-medium">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export { Textarea }
