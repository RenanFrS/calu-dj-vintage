"use client"

import { Menu, X } from "lucide-react"
import { FaTiktok, FaSpotify, FaYoutube, FaSoundcloud, FaInstagram } from 'react-icons/fa';
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import type { SiteSettings, SocialLink } from "@/types/payload"
import { getMediaUrl } from "@/types/payload"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n-context"

interface MediaSource {
  url: string
  mimeType?: string
}

interface DJHeroProps {
  siteSettings?: SiteSettings | null
  heroDesktopMedia?: MediaSource | null
  heroMobileMedia?: MediaSource | null
  heroOverlayOpacity?: number
}

// Mapeamento de ícones por plataforma
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  soundcloud: FaSoundcloud,
  spotify: FaSpotify,
  tiktok: FaTiktok,
}

// Detecta se a mídia é um vídeo
function isVideo(media: MediaSource | null | undefined): boolean {
  if (!media?.url) return false
  const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/mov']
  if (media.mimeType && videoMimeTypes.includes(media.mimeType)) return true
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']
  return videoExtensions.some(ext => media.url.toLowerCase().includes(ext))
}

// Componente de vídeo background
function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = async () => {
      try {
        video.muted = true
        video.playsInline = true
        video.loop = true
        video.autoplay = true
        video.load()
        await video.play()
      } catch (error) {
        console.warn('Autoplay bloqueado:', error)
      }
    }
    playVideo()
  }, [src])

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

export function DJHero({ siteSettings, heroDesktopMedia, heroMobileMedia, heroOverlayOpacity = 40 }: DJHeroProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useI18n()

  // Usar links do Payload (sem fallback)
  const socialLinks = siteSettings?.socialLinks?.filter(link => link.enabled !== false) || []
  const logoUrl = getMediaUrl(siteSettings?.logo)
  const logoAlt = siteSettings?.logoAlt || "Logo"

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Selecionar mídia baseado no tamanho da tela
  const currentMedia = isMobile 
    ? (heroMobileMedia?.url ? heroMobileMedia : heroDesktopMedia) 
    : heroDesktopMedia

  return (
    <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden border-0">
      {/* Background do Hero */}
      {currentMedia?.url && (
        <div className="absolute inset-0 z-0">
          {isVideo(currentMedia) ? (
            <HeroVideo src={currentMedia.url} />
          ) : (
            <Image
              src={currentMedia.url}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          )}
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: heroOverlayOpacity / 100 }}
          />
        </div>
      )}

      {/* Spline animated background */}
      {/* <div className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/motiontrails-BBtf0T09MvPoaXfC8iY8Rqga/"
          frameBorder={0}
          width="100%"
          height="100%"
          className="h-full w-full"
          style={{ pointerEvents: 'none' }}
        />
      </div> */}

      <div className="absolute inset-0 opacity-5 z-[1] border-0">
        <div
          className="absolute inset-0 border-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #192C66 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent pointer-events-auto border-0">
        <nav className="container mx-auto px-6 py-3 border-0" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            {/* Left - desktop links */}
            <div className="hidden md:flex gap-4 items-center">
              <a href="#music" className="text-foreground hover:text-primary transition-colors font-medium uppercase text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer px-3 py-2 rounded">
                {t("nav.music")}
              </a>
              <a href="#tour" className="text-foreground hover:text-primary transition-colors font-medium uppercase text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer px-3 py-2 rounded">
                {t("nav.schedule")}
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium uppercase text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer px-3 py-2 rounded">
                {t("nav.about")}
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium uppercase text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer px-3 py-2 rounded">
                {t("nav.contact")}
              </a>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={140}
                  height={44}
                  className="object-contain"
                  priority
                />
              ) : (
                <span className="text-2xl font-bold text-white font-serif">DJ CALU</span>
              )}
            </div>

            {/* Right - desktop icons + language flags + mobile menu button */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex gap-3 items-center">
                {socialLinks.map((link, index) => {
                  const IconComponent = socialIcons[link.platform]
                  if (!IconComponent) return null
                  return (
                    <a
                      key={link.id || index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                      className="text-foreground hover:text-primary transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer p-2"
                    >
                      <IconComponent className="h-10 w-10 transition-all duration-200" />
                    </a>
                  )
                })}
              </div>

              {/* Language Switcher Flags - after social icons */}
              <LanguageSwitcher />

              <button
                className="md:hidden text-foreground p-2 rounded focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2"
                onClick={() => setMobileOpen((s) => !s)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden mt-3 bg-primary/10 backdrop-blur-sm rounded-md p-3 space-y-2 shadow-lg">
              <a href="#music" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">{t("nav.music")}</a>
              <a href="#tour" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">{t("nav.schedule")}</a>
              <a href="#about" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">{t("nav.about")}</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">{t("nav.contact")}</a>
            </div>
          )}
        </nav>
      </header>

      {/* Background overlay - removido pois o DynamicBackground já tem overlay configurável */}

      {/* Content - simplified centered hero (header/nav kept) */}
      <div className="relative z-30 w-full flex items-center justify-center min-h-screen">
        <div className="text-center px-6 py-32">
          <h2 className="!text-[24px] md:!text-[24px] uppercase tracking-wider text-white opacity-80">{t("hero.listening")}</h2>
          <h1 className="mt-4 text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white">DJ CALU</h1>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
        {/* Desktop / tablet: mouse frame with bouncing dot */}
        <div className="hidden sm:flex w-6 h-10 border-2 border-secondary/40 rounded-full items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
        {/* Mobile: only the small bouncing dot (no round frame) */}
        <div className="flex sm:hidden items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
