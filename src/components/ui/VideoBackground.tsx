'use client'

import { useReducedMotion } from 'motion/react'

interface VideoBackgroundProps {
  src: string
  poster?: string
  className?: string
  overlayClassName?: string
  children?: React.ReactNode
}

export function VideoBackground({
  src,
  poster,
  className = '',
  overlayClassName = 'bg-carbon/70',
  children,
}: VideoBackgroundProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video is hidden when user prefers reduced motion — poster image shows instead */}
      {!reduced && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      {/* Poster fallback always rendered beneath the video */}
      {poster && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})`, zIndex: reduced ? 0 : -1 }}
          aria-hidden="true"
        />
      )}
      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden="true" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
