import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import type { DeliveredVehicle } from '@/data/deliveredVehicles'

type Props = { vehicle: DeliveredVehicle }

export function DeliveredVehicleCard({ vehicle }: Props) {
  const t = useTranslations()
  return (
    <article className="group rounded-xl overflow-hidden bg-graphite border border-white/5 hover:border-red-accent/30 hover:shadow-[0_0_30px_rgba(215,25,32,0.08)] transition-all duration-300">
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
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-steel font-mono text-lg">{vehicle.brand}</span>
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
        {vehicle.specs && <p className="text-steel text-xs font-mono">{vehicle.specs}</p>}
        {vehicle.year && <p className="text-steel text-xs font-mono">{vehicle.year}</p>}
      </div>
    </article>
  )
}
