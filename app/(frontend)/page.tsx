import { getSiteSettings, getAbout, getTours, getSets, getGalleryImages } from '@/lib/payload'
import HomeClient from './home-client'
import type { SiteSettings, About, Tour, Set, GalleryImage, Media } from '@/types/payload'
import type { Metadata } from 'next'
import { getMediaUrl } from '@/types/payload'

// Frontend usa cache curto + revalidação on-demand via hooks do Payload (lib/revalidate.ts)
export const revalidate = 10

export async function generateMetadata(): Promise<Metadata> {
  let siteSettings: SiteSettings | null = null

  try {
    siteSettings = await getSiteSettings() as SiteSettings
  } catch (error) {
    console.error('Erro ao buscar configurações do site para metadata:', error)
  }

  const title = siteSettings?.siteTitle || 'Calu DJ - Vintage Music Vibes'
  const description = siteSettings?.siteDescription || 'Página oficial do Calu DJ - Som vintage e retrô para os melhores palcos do mundo'
  const ogImage = getMediaUrl(siteSettings?.ogImage as Media | string | undefined)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function Home() {
  const [siteSettingsRes, aboutRes, toursRes, setsRes, galleryRes] = await Promise.allSettled([
    getSiteSettings(),
    getAbout(),
    getTours(10),
    getSets(10),
    getGalleryImages(20),
  ])

  if (siteSettingsRes.status === 'rejected') console.error('Erro ao buscar configurações do site:', siteSettingsRes.reason)
  if (aboutRes.status === 'rejected') console.error('Erro ao buscar informações sobre:', aboutRes.reason)
  if (toursRes.status === 'rejected') console.error('Erro ao buscar tours:', toursRes.reason)
  if (setsRes.status === 'rejected') console.error('Erro ao buscar sets:', setsRes.reason)
  if (galleryRes.status === 'rejected') console.error('Erro ao buscar imagens da galeria:', galleryRes.reason)

  const siteSettings = siteSettingsRes.status === 'fulfilled' ? (siteSettingsRes.value as SiteSettings) : null
  const about = aboutRes.status === 'fulfilled' ? (aboutRes.value as About) : null
  const tours = toursRes.status === 'fulfilled' ? (toursRes.value as Tour[]) : []
  const sets = setsRes.status === 'fulfilled' ? (setsRes.value as Set[]) : []
  const galleryImages = galleryRes.status === 'fulfilled' ? (galleryRes.value as GalleryImage[]) : []

  return (
    <HomeClient
      siteSettings={siteSettings}
      about={about}
      tours={tours}
      sets={sets}
      galleryImages={galleryImages}
    />
  )
}
