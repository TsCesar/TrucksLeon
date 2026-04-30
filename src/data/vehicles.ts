export type Vehicle = {
  id: string
  name: string
  brand: string
  category: string
  year?: number
  km?: number
  power?: string
  axles?: string
  euro?: string
  image?: string
  featured?: boolean
}

// Placeholder data — to be populated with real catalog in future phases
export const vehicles: Vehicle[] = []
