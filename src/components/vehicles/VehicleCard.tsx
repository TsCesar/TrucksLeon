import Image from 'next/image'
import type { Vehicle } from '@/data/vehicles'

type Props = { vehicle: Vehicle }

export function VehicleCard({ vehicle }: Props) {
  return (
    <article className="group rounded-xl overflow-hidden bg-graphite border border-white/5 hover:border-red-accent/30 transition-all duration-300">
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
            <span className="text-steel font-mono">{vehicle.brand}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-red-accent font-mono font-semibold uppercase tracking-wider mb-1">{vehicle.brand}</p>
        <h3 className="text-off-white font-heading font-semibold text-sm leading-tight mb-2">{vehicle.name}</h3>
        <div className="flex flex-wrap gap-2">
          {vehicle.year && <span className="text-steel text-xs font-mono">{vehicle.year}</span>}
          {vehicle.power && <span className="text-steel text-xs font-mono">{vehicle.power}</span>}
          {vehicle.euro && <span className="text-steel text-xs font-mono">Euro {vehicle.euro}</span>}
        </div>
      </div>
    </article>
  )
}
