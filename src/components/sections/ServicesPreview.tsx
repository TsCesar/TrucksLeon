'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import {
  MessageSquare, Settings, FileText, ArrowLeftRight, PackageOpen, Package,
  Truck, Map, ShieldCheck, Award, ClipboardList, Stamp,
} from 'lucide-react'
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import { RoomEntry } from '@/components/animations/RoomEntry'
import { VehicleStreaks } from '@/components/animations/VehicleStreaks'
import { services } from '@/data/services'

const iconMap: Record<string, React.ElementType> = {
  MessageSquare, Settings, FileText, ArrowLeftRight, PackageOpen, Package,
  Stamp, Truck, Map, ShieldCheck, Award, ClipboardList,
}

type Service = (typeof services)[number]

function ServiceCard3D({ service, index }: { service: Service; index: number }) {
  const t = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useTransform(my, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-6, 6])
  const glowX = useTransform(mx, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(my, [-0.5, 0.5], [0, 100])

  const sConfig = { stiffness: 180, damping: 22 }
  const springRX = useSpring(rotateX, sConfig)
  const springRY = useSpring(rotateY, sConfig)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || prefersReducedMotion) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  const Icon = iconMap[service.icon] ?? Truck
  const ghostNum = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: prefersReducedMotion ? 0 : springRX,
        rotateY: prefersReducedMotion ? 0 : springRY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      className="group relative p-6 rounded-xl bg-surface border border-line/[0.09] shadow-card hover:border-red-accent/30 hover:shadow-[0_2px_4px_rgb(15_23_42_/_0.04),0_18px_40px_-22px_rgb(215_25_32_/_0.28)] transition-[border-color,box-shadow] duration-300 h-full overflow-hidden cursor-default"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />

      {/* Dynamic spotlight */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{
          background: prefersReducedMotion
            ? undefined
            : `radial-gradient(circle at ${glowX}% ${glowY}%, rgb(215 25 32 / 0.06) 0%, transparent 65%)`,
        }}
        aria-hidden
      />

      {/* Ghost number */}
      <span
        className="absolute top-1 right-3 font-mono text-[4.5rem] font-bold text-line/[0.05] leading-none select-none pointer-events-none group-hover:text-red-accent/[0.10] transition-colors duration-500"
        aria-hidden
      >
        {ghostNum}
      </span>

      <div className="w-11 h-11 rounded-xl bg-red-accent/[0.08] ring-1 ring-red-accent/12 flex items-center justify-center mb-4 group-hover:bg-red-accent/[0.14] group-hover:ring-red-accent/25 group-hover:scale-105 transition-all duration-300 relative z-10">
        <Icon size={20} className="text-red-accent" aria-hidden />
      </div>

      <h3 className="font-heading font-semibold text-ink text-sm mb-2 relative z-10">
        {t(service.titleKey)}
      </h3>
      <p className="text-steel text-xs leading-relaxed relative z-10">
        {t(service.descriptionKey)}
      </p>
    </motion.div>
  )
}

export function ServicesPreview() {
  const t = useTranslations()

  return (
    <Section tone="mist" id="servicios" className="relative overflow-hidden">
      <VehicleStreaks />
      <Container className="relative">
        <RoomEntry tiltX={6} tiltY={-3}>
          <SectionHeader
            badge={t('nav.services')}
            title={t('services.title')}
            subtitle={t('services.subtitle')}
          />
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <StaggerItem key={service.id}>
                <ServiceCard3D service={service} index={index} />
              </StaggerItem>
            ))}
          </Stagger>
        </RoomEntry>
      </Container>
    </Section>
  )
}
