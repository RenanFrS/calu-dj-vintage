import { getSiteSettings, getAbout, getTours, getSets, getGalleryImages } from '@/lib/payload'
import HomeClient from './home-client'
import type { SiteSettings, About, Tour, Set, GalleryImage } from '@/types/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidar a cada 60 segundos

export default async function Home() {
  // Buscar dados do PayloadCMS
  let siteSettings: SiteSettings | null = null
  let about: About | null = null
  let tours: Tour[] = []
  let sets: Set[] = []
  let galleryImages: GalleryImage[] = []

  try {
    siteSettings = await getSiteSettings() as SiteSettings
  } catch (error) {
    console.error('Erro ao buscar configurações do site:', error)
  }

  try {
    about = await getAbout() as About
  } catch (error) {
    console.error('Erro ao buscar informações sobre:', error)
  }

  try {
    tours = await getTours(10) as Tour[]
  } catch (error) {
    console.error('Erro ao buscar tours:', error)
  }

  try {
    sets = await getSets(10) as Set[]
  } catch (error) {
    console.error('Erro ao buscar sets:', error)
  }

  try {
    galleryImages = await getGalleryImages(20) as GalleryImage[]
  } catch (error) {
    console.error('Erro ao buscar imagens da galeria:', error)
  }

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
