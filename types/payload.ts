// Tipos gerados pelo PayloadCMS
// Execute `npm run generate:types` para gerar os tipos automaticamente

export interface Media {
  id: string
  alt: string
  url?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  sizes?: {
    thumbnail?: { url?: string; width?: number; height?: number }
    card?: { url?: string; width?: number; height?: number }
    hero?: { url?: string; width?: number; height?: number }
  }
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

export interface GalleryImage {
  id: string
  title: string
  image: Media | string
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
  // Background Hero
  heroBackgroundDesktop?: Media | string
  heroBackgroundMobile?: Media | string
  heroOverlayOpacity?: number
  // Background Seções (unificado para todas as seções abaixo do hero)
  sectionsBackgroundDesktop?: Media | string
  sectionsBackgroundMobile?: Media | string
  sectionsOverlayOpacity?: number
  // Social Links
  socialLinks?: SocialLink[]
  // Textos
  heroTitle?: string
  heroSubtitle?: string
  footerTagline?: string
  copyrightText?: string
  // SEO
  siteTitle?: string
  siteDescription?: string
  ogImage?: Media | string
}

export interface AboutParagraph {
  id?: string
  content: string
}

export interface About {
  profileImage: Media | string
  // Português
  title_pt?: string
  subtitle_pt?: string
  paragraphs_pt?: AboutParagraph[]
  tagline_pt?: string
  // English
  title_en?: string
  subtitle_en?: string
  paragraphs_en?: AboutParagraph[]
  tagline_en?: string
  // Français
  title_fr?: string
  subtitle_fr?: string
  paragraphs_fr?: AboutParagraph[]
  tagline_fr?: string
}

// Helper para extrair URL de mídia
export function getMediaUrl(media: Media | string | undefined | null): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media.url || null
}
