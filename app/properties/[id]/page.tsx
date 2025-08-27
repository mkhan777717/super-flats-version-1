import { PropertyGallery } from "@/components/property-gallery"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  return <PropertyGallery propertyId={id} />
}
