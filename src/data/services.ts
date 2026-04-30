export type Service = {
  id: string
  icon: string
  titleKey: string
  descriptionKey: string
}

export const services: Service[] = [
  { id: 'advisory', icon: 'MessageSquare', titleKey: 'services.advisory.title', descriptionKey: 'services.advisory.description' },
  { id: 'management', icon: 'Settings', titleKey: 'services.management.title', descriptionKey: 'services.management.description' },
  { id: 'documentation', icon: 'FileText', titleKey: 'services.documentation.title', descriptionKey: 'services.documentation.description' },
  { id: 'buy-sell', icon: 'ArrowLeftRight', titleKey: 'services.buySell.title', descriptionKey: 'services.buySell.description' },
  { id: 'import', icon: 'PackageOpen', titleKey: 'services.import.title', descriptionKey: 'services.import.description' },
  { id: 'export', icon: 'Package', titleKey: 'services.export.title', descriptionKey: 'services.export.description' },
  { id: 'customs', icon: 'Stamp', titleKey: 'services.customs.title', descriptionKey: 'services.customs.description' },
  { id: 'transport', icon: 'Truck', titleKey: 'services.transport.title', descriptionKey: 'services.transport.description' },
  { id: 'logistics', icon: 'Map', titleKey: 'services.logistics.title', descriptionKey: 'services.logistics.description' },
  { id: 'homologation', icon: 'ShieldCheck', titleKey: 'services.homologation.title', descriptionKey: 'services.homologation.description' },
  { id: 'certificates', icon: 'Award', titleKey: 'services.certificates.title', descriptionKey: 'services.certificates.description' },
  { id: 'appraisal', icon: 'ClipboardList', titleKey: 'services.appraisal.title', descriptionKey: 'services.appraisal.description' },
]
