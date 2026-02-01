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
import { Heart } from "lucide-react"
import { getMediaUrl } from "@/types/payload"
import type { SiteSettings, About, Tour, Set, GalleryImage } from "@/types/payload"

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

  // Processar background do hero (somente do Payload)
  const heroBackgroundDesktop = getMediaUrl(siteSettings?.heroBackgroundDesktop)
  const heroBackgroundMobile = getMediaUrl(siteSettings?.heroBackgroundMobile) || heroBackgroundDesktop
  const useVideoBackground = siteSettings?.useVideoBackground !== false

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
    <>
      {loading && <VinylPreloader onComplete={handleLoadingComplete} />}

      <div className={`${showContent ? "opacity-100" : "opacity-0"}`}>
        {/* Background video/image (under the hero) */}
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none border-0">
          {heroBackgroundDesktop ? (
            useVideoBackground ? (
              <>
                {/* Desktop */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="hidden md:block w-full h-full absolute inset-0 object-cover"
                  style={{ pointerEvents: 'none' }} 
                >
                  <source 
                    src={heroBackgroundDesktop} 
                    type="video/mp4" 
                  />
                </video>
                {/* Mobile */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="md:hidden w-full h-full absolute inset-0 object-cover"
                  style={{ pointerEvents: 'none' }} 
                >
                  <source 
                    src={heroBackgroundMobile || heroBackgroundDesktop} 
                    type="video/mp4" 
                  />
                </video>
              </>
            ) : (
              <>
                {/* Desktop image */}
                <div className="hidden md:block absolute inset-0">
                  <Image 
                    src={heroBackgroundDesktop} 
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Mobile image */}
                <div className="md:hidden absolute inset-0">
                  <Image 
                    src={heroBackgroundMobile || heroBackgroundDesktop} 
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </>
            )
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
          )}
          <div className="absolute inset-0 bg-black opacity-40 pointer-events-none border-0" />
        </div>

        <main className="min-h-screen">
          <DJHero siteSettings={siteSettings} />

          {/* Quem sou */}
          <section id="about" className="py-20">
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

        </main>
        <Footer siteSettings={siteSettings} />
      </div>
    </>
  )
}
