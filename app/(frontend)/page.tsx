import { getSiteSettings, getAbout, getTours, getSets, getGalleryImages, getReviews } from '@/lib/payload'
import HomeClient from './home-client'
import { StructuredData } from '@/components/seo/StructuredData'
import type { SiteSettings, About, Tour, Set, GalleryImage, Review, Media } from '@/types/payload'
import type { Metadata } from 'next'
import { getMediaUrl } from '@/types/payload'
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_KEYWORDS,
} from '@/lib/site'

// Frontend usa cache curto + revalidação on-demand via hooks do Payload (lib/revalidate.ts)
export const revalidate = 10

export async function generateMetadata(): Promise<Metadata> {
  let siteSettings: SiteSettings | null = null

  try {
    siteSettings = await getSiteSettings() as SiteSettings
  } catch (error) {
    console.error('Erro ao buscar configurações do site para metadata:', error)
  }

  const title = siteSettings?.siteTitle || DEFAULT_TITLE
  const description = siteSettings?.siteDescription || DEFAULT_DESCRIPTION
  const ogImage = getMediaUrl(siteSettings?.ogImage as Media | string | undefined) || DEFAULT_OG_IMAGE

  return {
    title: { absolute: title },
    description,
    keywords: SITE_KEYWORDS,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Home() {
  const [siteSettingsRes, aboutRes, toursRes, setsRes, galleryRes, reviewsRes] = await Promise.allSettled([
    getSiteSettings(),
    getAbout(),
    getTours(10),
    getSets(10),
    getGalleryImages(20),
    getReviews(12),
  ])

  if (siteSettingsRes.status === 'rejected') console.error('Erro ao buscar configurações do site:', siteSettingsRes.reason)
  if (aboutRes.status === 'rejected') console.error('Erro ao buscar informações sobre:', aboutRes.reason)
  if (toursRes.status === 'rejected') console.error('Erro ao buscar tours:', toursRes.reason)
  if (setsRes.status === 'rejected') console.error('Erro ao buscar sets:', setsRes.reason)
  if (galleryRes.status === 'rejected') console.error('Erro ao buscar imagens da galeria:', galleryRes.reason)
  if (reviewsRes.status === 'rejected') console.error('Erro ao buscar avaliações:', reviewsRes.reason)

  const siteSettings = siteSettingsRes.status === 'fulfilled' ? (siteSettingsRes.value as SiteSettings) : null
  const about = aboutRes.status === 'fulfilled' ? (aboutRes.value as About) : null
  const tours = toursRes.status === 'fulfilled' ? (toursRes.value as Tour[]) : []
  const sets = setsRes.status === 'fulfilled' ? (setsRes.value as Set[]) : []
  const galleryImages = galleryRes.status === 'fulfilled' ? (galleryRes.value as GalleryImage[]) : []
  const reviews = reviewsRes.status === 'fulfilled' ? (reviewsRes.value as Review[]) : []

  return (
    <>
      <StructuredData siteSettings={siteSettings} />
      <HomeClient
        siteSettings={siteSettings}
        about={about}
        tours={tours}
        sets={sets}
        galleryImages={galleryImages}
        reviews={reviews}
      />
    </>
  )
}
