"use client"

import { useState, useEffect, useMemo } from "react"
import { VinylPreloader } from "@/components/vinyl-preloader"
import { DJHero } from "@/components/dj-hero"
import { LatestTracks } from "@/components/latest-tracks"
import Masonry from "@/components/Masonry"
import { SpotifySection } from "@/components/spotify-section"
import { GoogleReviewsSection } from "@/components/google-reviews-section"
import { QuoteSection } from "@/components/quote-section"
import { TourSection } from "@/components/tour-section"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"
import { DynamicBackground, toMediaSource } from "@/components/dynamic-background"
import { getMediaUrl } from "@/types/payload"
import { I18nProvider } from "@/lib/i18n-context"
import type { SiteSettings, About, Tour, Set, GalleryImage, Review, Media } from "@/types/payload"

interface HomeClientProps {
  siteSettings: SiteSettings | null
  about: About | null
  tours: Tour[]
  sets: Set[]
  galleryImages: GalleryImage[]
  reviews: Review[]
}

export default function HomeClient({
  siteSettings,
  about,
  tours,
  sets,
  galleryImages,
  reviews,
}: HomeClientProps) {
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const processedGalleryImages = useMemo(
    () =>
      galleryImages
        .map((img) => getMediaUrl(img.image))
        .filter((src): src is string => Boolean(src)),
    [galleryImages],
  )

  const heroDesktopMedia = toMediaSource(siteSettings?.heroBackgroundDesktop as Media | string | undefined)
  const heroMobileMedia = toMediaSource(siteSettings?.heroBackgroundMobile as Media | string | undefined)
  const heroOverlayOpacity = siteSettings?.heroOverlayOpacity ?? 40

  const sectionsDesktopMedia = toMediaSource(siteSettings?.sectionsBackgroundDesktop as Media | string | undefined)
  const sectionsMobileMedia = toMediaSource(siteSettings?.sectionsBackgroundMobile as Media | string | undefined)
  const sectionsOverlayOpacity = siteSettings?.sectionsOverlayOpacity ?? 60

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

      <div className={`${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <main className="min-h-screen">
          <DJHero
            siteSettings={siteSettings}
            heroDesktopMedia={heroDesktopMedia}
            heroMobileMedia={heroMobileMedia}
            heroOverlayOpacity={heroOverlayOpacity}
          />

          <div className="relative">
            {(sectionsDesktopMedia || sectionsMobileMedia) && (
              <DynamicBackground
                desktopMedia={sectionsDesktopMedia}
                mobileMedia={sectionsMobileMedia}
                overlayOpacity={sectionsOverlayOpacity}
                className="!fixed"
              />
            )}

            <AboutSection about={about} />

            <Masonry id="gallery" className="py-12" images={processedGalleryImages} />

            <TourSection tours={tours} />
            <LatestTracks sets={sets} />
            <SpotifySection />
            <GoogleReviewsSection reviews={reviews} />
            <QuoteSection />
          </div>
        </main>
        <Footer siteSettings={siteSettings} />
      </div>
    </I18nProvider>
  )
}
