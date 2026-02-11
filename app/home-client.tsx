"use client"

import { useState, useEffect } from "react"
import { VinylPreloader } from "@/components/vinyl-preloader"
import { DJHero } from "@/components/dj-hero"
import { LatestTracks } from "@/components/latest-tracks"
import Masonry from "@/components/Masonry"
import { SpotifySection } from "@/components/spotify-section"
import { QuoteSection } from "@/components/quote-section"
import { TourSection } from "@/components/tour-section"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"
import { DynamicBackground, toMediaSource } from "@/components/dynamic-background"
import { getMediaUrl } from "@/types/payload"
import { I18nProvider } from "@/lib/i18n-context"
import type { SiteSettings, About, Tour, Set, GalleryImage, Media } from "@/types/payload"

interface HomeClientProps {
  siteSettings: SiteSettings | null
  about: About | null
  tours: Tour[]
  sets: Set[]
  galleryImages: GalleryImage[]
}

export default function HomeClient({ 
  siteSettings, 
  about, 
  tours, 
  sets, 
  galleryImages 
}: HomeClientProps) {
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Processar imagens da galeria (somente do Payload)
  const processedGalleryImages = galleryImages.map(img => getMediaUrl(img.image) || '').filter(Boolean)

  // Preparar mídias do background hero
  const heroDesktopMedia = toMediaSource(siteSettings?.heroBackgroundDesktop as Media | string | undefined)
  const heroMobileMedia = toMediaSource(siteSettings?.heroBackgroundMobile as Media | string | undefined)
  const heroOverlayOpacity = siteSettings?.heroOverlayOpacity ?? 40

  // Preparar mídias do background das seções (unificado)
  const sectionsDesktopMedia = toMediaSource(siteSettings?.sectionsBackgroundDesktop as Media | string | undefined)
  const sectionsMobileMedia = toMediaSource(siteSettings?.sectionsBackgroundMobile as Media | string | undefined)
  const sectionsOverlayOpacity = siteSettings?.sectionsOverlayOpacity ?? 60

  // Safety fallback: in case preloader gets stuck for any reason, remove it after 8s
  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setShowContent(true)
      }
    }, 8000)
    return () => clearTimeout(t)
  }, [loading])

  const handleLoadingComplete = () => {
    setLoading(false)
    setShowContent(true)
  }

  return (
    <I18nProvider>
      {loading && <VinylPreloader onComplete={handleLoadingComplete} />}

      <div className={`${showContent ? "opacity-100" : "opacity-0"}`}>
        <main className="min-h-screen">
          <DJHero 
            siteSettings={siteSettings}
            heroDesktopMedia={heroDesktopMedia}
            heroMobileMedia={heroMobileMedia}
            heroOverlayOpacity={heroOverlayOpacity}
          />

          {/* Container com background unificado para seções abaixo do hero */}
          <div className="relative">
            {/* Background fixo das seções */}
            {(sectionsDesktopMedia || sectionsMobileMedia) && (
              <DynamicBackground
                desktopMedia={sectionsDesktopMedia}
                mobileMedia={sectionsMobileMedia}
                overlayOpacity={sectionsOverlayOpacity}
                className="!fixed"
              />
            )}

          {/* Quem sou */}
          <AboutSection about={about} />
          
          <Masonry id="gallery" className="py-12" images={processedGalleryImages} />

          <TourSection tours={tours} />
          <LatestTracks sets={sets} />
          <SpotifySection />
          <QuoteSection />

          </div>{/* Fim do container com background das seções */}

        </main>
        <Footer siteSettings={siteSettings} />
      </div>
    </I18nProvider>
  )
}
