import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Truck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { DeliveredVehicle } from '@/data/deliveredVehicles'

type Props = { vehicle: DeliveredVehicle }

export function DeliveredVehicleCard({ vehicle }: Props) {
  const t = useTranslations()
  return (
    <article className="group rounded-xl overflow-hidden bg-graphite border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_30px_rgba(215,25,32,0.1)] transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-carbon">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04]"
              aria-hidden
              style={{
                backgroundImage:
                  'linear-gradient(rgba(248,250,252,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.4) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <Truck size={28} className="text-steel/20" aria-hidden />
            <span className="text-steel/40 font-mono text-xs font-semibold tracking-widest uppercase">
              {vehicle.brand}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="red">{t('delivered.badge')}</Badge>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-red-accent font-mono font-semibold uppercase tracking-wider mb-1">{vehicle.brand}</p>
        <h3 className="text-off-white font-heading font-semibold text-sm leading-tight mb-2">{vehicle.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {vehicle.specs && (
            <span className="text-steel text-xs font-mono">{vehicle.specs}</span>
          )}
          {vehicle.year && (
            <span className="text-steel/50 text-xs font-mono">{vehicle.year}</span>
          )}
        </div>
      </div>
    </article>
  )
}
