export type NavItem = {
  labelKey: string
  href: string
}

export const navItems: NavItem[] = [
  { labelKey: 'nav.home', href: '/' },
  { labelKey: 'nav.about', href: '/quienes-somos' },
  { labelKey: 'nav.services', href: '/servicios' },
  { labelKey: 'nav.vehicles', href: '/vehiculos' },
  { labelKey: 'nav.delivered', href: '/vehiculos-entregados' },
  { labelKey: 'nav.process', href: '/proceso' },
  { labelKey: 'nav.europe', href: '/europa' },
  { labelKey: 'nav.news', href: '/novedades' },
  { labelKey: 'nav.contact', href: '/contacto' },
]
