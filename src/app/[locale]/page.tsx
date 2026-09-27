import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { HeroBase } from '@/components/sections/HeroBase'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { VehicleCategoriesPreview } from '@/components/sections/VehicleCategoriesPreview'
import { DeliveredPreview } from '@/components/sections/DeliveredPreview'
import { ProcessPreview } from '@/components/sections/ProcessPreview'
import { EuropePreview } from '@/components/sections/EuropePreview'
import { ContactPreview } from '@/components/sections/ContactPreview'
import { SectionTransition } from '@/components/animations/SectionTransition'
import { buildMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({ locale, page: 'home' })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <JsonLd locale={locale} page="home" />
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
