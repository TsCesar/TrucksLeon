import type { Metadata } from 'next'
import { HeroBase } from '@/components/sections/HeroBase'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { VehicleCategoriesPreview } from '@/components/sections/VehicleCategoriesPreview'
import { DeliveredPreview } from '@/components/sections/DeliveredPreview'
import { ProcessPreview } from '@/components/sections/ProcessPreview'
import { EuropePreview } from '@/components/sections/EuropePreview'
import { ContactPreview } from '@/components/sections/ContactPreview'
import { SectionTransition } from '@/components/animations/SectionTransition'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({ locale })
}

export default function HomePage() {
  return (
    <>
      <HeroBase />
      <SectionTransition />
      <ServicesPreview />
      <SectionTransition />
      <VehicleCategoriesPreview />
      <SectionTransition />
      <ProcessPreview />
      <SectionTransition />
      <EuropePreview />
      <SectionTransition />
      <DeliveredPreview />
      <SectionTransition />
      <ContactPreview />
    </>
  )
}
