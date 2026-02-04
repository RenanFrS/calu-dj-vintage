"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { VinylPreloader } from "@/components/vinyl-preloader"
import { DJHero } from "@/components/dj-hero"
import { LatestTracks } from "@/components/latest-tracks"
import Masonry from "@/components/Masonry"
import { SpotifySection } from "@/components/spotify-section"
import { QuoteSection } from "@/components/quote-section"
import { TourSection } from "@/components/tour-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"
import { DynamicBackground, toMediaSource } from "@/components/dynamic-background"
import { Heart } from "lucide-react"
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
        {/* Background dinâmico do Hero (suporta imagem, GIF e vídeo) */}
        <DynamicBackground
          desktopMedia={heroDesktopMedia}
          mobileMedia={heroMobileMedia}
          overlayOpacity={heroOverlayOpacity}
        />

        <main className="min-h-screen">
          <DJHero siteSettings={siteSettings} />

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
          <section id="about" className="py-20 relative z-10">
            <div className="container mx-auto px-6">
              {about ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-center md:text-left">
                      <h2 className="text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-white mb-4">
                        {about.title}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0">
                        {about.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      {getMediaUrl(about.profileImage) && (
                        <div className="w-72 h-72 md:w-96 md:h-96 relative rounded-full overflow-hidden shadow-2xl">
                          <Image 
                            src={getMediaUrl(about.profileImage)!} 
                            alt={about.title || "Perfil"} 
                            fill 
                            sizes="(max-width: 768px) 18rem, 24rem" 
                            className="object-cover" 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {about.paragraphs && about.paragraphs.length > 0 && (
                    <div className="mt-8 md:mt-12 flex justify-center">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300 text-[17px] leading-relaxed max-w-5xl">
                        {about.paragraphs.map((paragraph, index) => (
                          <div key={paragraph.id || index}>
                            <p>{paragraph.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {about.tagline && (
                    <div className="mt-8 md:mt-12 text-center">
                      <p className="text-2xl md:text-3xl lg:text-4xl text-white max-w-2xl mx-auto flex items-center gap-4 justify-center">
                        <span className="leading-tight">{about.tagline}</span>
                        <Heart className="flex-shrink-0 w-6 h-6" aria-hidden="false" aria-label="coração" />
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">Configure no seu painel de admin!</p>
                </div>
              )}
            </div>
          </section>
          
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
