export type VehicleCategory = {
  id: string
  slug: string
  titleKey: string
  image?: string
}

export const vehicleCategories: VehicleCategory[] = [
  { id: 'tractor-heads', slug: 'cabezas-tractoras', titleKey: 'categories.tractorHeads', image: '/images/vehicles/category-cabezas-tractoras.jpg' },
  { id: 'rigid-trucks', slug: 'camiones-rigidos', titleKey: 'categories.rigidTrucks', image: '/images/vehicles/category-camiones-rigidos.jpg' },
  { id: 'vans', slug: 'furgonetas', titleKey: 'categories.vans', image: '/images/vehicles/category-furgonetas.jpg' },
  { id: 'livestock-trucks', slug: 'camiones-ganaderos', titleKey: 'categories.livestockTrucks', image: '/images/vehicles/category-ganaderos.jpg' },
  { id: 'box-trucks', slug: 'camiones-caja-cerrada', titleKey: 'categories.boxTrucks', image: '/images/vehicles/category-caja-cerrada.jpg' },
  { id: 'crane-trucks', slug: 'camiones-grua', titleKey: 'categories.craneTrucks', image: '/images/vehicles/category-grua.jpg' },
  { id: 'concrete-mixers', slug: 'hormigoneras', titleKey: 'categories.concreteMixers', image: '/images/vehicles/category-hormigoneras.jpg' },
  { id: 'refrigerated', slug: 'camiones-frigorificos', titleKey: 'categories.refrigerated', image: '/images/vehicles/category-frigorificos.jpg' },
  { id: 'car-carriers', slug: 'portacoches', titleKey: 'categories.carCarriers', image: '/images/vehicles/category-portacoches.jpg' },
  { id: 'extendable-trailers', slug: 'semirremolques-extensibles', titleKey: 'categories.extendableTrailers', image: '/images/vehicles/category-extensibles.jpg' },
  { id: 'livestock-trailers', slug: 'semirremolques-ganaderos', titleKey: 'categories.livestockTrailers', image: '/images/vehicles/category-ganaderos-trailers.jpg' },
  { id: 'cars', slug: 'coches', titleKey: 'categories.cars' },
]
