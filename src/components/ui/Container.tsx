import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  narrow?: boolean
}

export function Container({ narrow, className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-4xl' : 'max-w-[1440px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
