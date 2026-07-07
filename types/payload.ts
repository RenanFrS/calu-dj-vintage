// Tipos do PayloadCMS (manuais, sincronizados com `payload-types.ts`)

export interface Media {
  id: string
  alt: string
  url?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  // Campos extras adicionados pelo adapter do Cloudinary
  cloudinaryPublicId?: string
  cloudinaryResourceType?: 'image' | 'video' | 'raw'
  cloudinaryFormat?: string
  cloudinarySecureUrl?: string
}

export interface Tour {
  id: string
  eventImage?: Media | string
  date: string
  venue: string
  location: string
  hasTickets?: boolean
  status?: 'available' | 'few-tickets' | 'sold-out'
  ticketUrl?: string
  featured?: boolean
  order?: number
}

export interface Set {
  id: string
  title: string
  featuring?: string
  platform: 'youtube' | 'soundcloud' | 'spotify' | 'mixcloud'
  videoUrl?: string
  embedUrl?: string
  thumbnail?: Media | string
  order?: number
  featured?: boolean
}

export interface ImageCrop {
  x: number
  y: number
  width: number
  height: number
  aspect?: number | null
}

export interface GalleryImage {
  id: string
  title: string
  image: Media | string
  imageCrop?: ImageCrop | null
  order?: number
  featured?: boolean
}

export interface SocialLink {
  id?: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'soundcloud' | 'spotify' | 'twitter' | 'facebook' | 'email'
  url: string
  enabled?: boolean
}

export interface SiteSettings {
  logo?: Media | string
  logoAlt?: string
  heroBackgroundDesktop?: Media | string
  heroBackgroundDesktopCrop?: ImageCrop | null
  heroBackgroundMobile?: Media | string
  heroBackgroundMobileCrop?: ImageCrop | null
  heroOverlayOpacity?: number
  sectionsBackgroundDesktop?: Media | string
  sectionsBackgroundDesktopCrop?: ImageCrop | null
  sectionsBackgroundMobile?: Media | string
  sectionsBackgroundMobileCrop?: ImageCrop | null
  sectionsOverlayOpacity?: number
  socialLinks?: SocialLink[]
  heroTitle?: string
  heroSubtitle?: string
  footerTagline?: string
  copyrightText?: string
  siteTitle?: string
  siteDescription?: string
  ogImage?: Media | string
}

export interface Review {
  id?: string
  authorName: string
  avatar?: Media | string
  rating: number
  text: string
  date?: string
  order?: number
  featured?: boolean
}

export interface AboutParagraph {
  id?: string
  content: string
}

export interface About {
  profileImage: Media | string
  title_pt?: string
  subtitle_pt?: string
  paragraphs_pt?: AboutParagraph[]
  tagline_pt?: string
  title_en?: string
  subtitle_en?: string
  paragraphs_en?: AboutParagraph[]
  tagline_en?: string
  title_fr?: string
  subtitle_fr?: string
  paragraphs_fr?: AboutParagraph[]
  tagline_fr?: string
}

// Helper para extrair URL de mídia
export function getMediaUrl(media: Media | string | undefined | null): string | null {
  if (!media) return null
  if (typeof media === 'string') {
    // Strings só são válidas se forem URLs absolutas ou paths absolutos
    if (media.startsWith('http://') || media.startsWith('https://') || media.startsWith('/')) {
      return media
    }
    return null
  }
  return media.cloudinarySecureUrl || media.url || null
}

// Helper para detectar se uma mídia do Payload é vídeo
export function isVideoMedia(media: Media | string | undefined | null): boolean {
  if (!media || typeof media === 'string') return false
  if (media.cloudinaryResourceType === 'video') return true
  if (media.mimeType?.startsWith('video/')) return true
  return false
}

// Helper para extrair o publicId do Cloudinary
export function getCloudinaryPublicId(media: Media | string | undefined | null): string | null {
  if (!media || typeof media === 'string') return null
  return media.cloudinaryPublicId || null
}
