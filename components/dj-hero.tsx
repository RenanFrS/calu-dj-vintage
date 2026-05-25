"use client"

import { Menu, X } from "lucide-react"
import { FaTiktok, FaSpotify, FaYoutube, FaSoundcloud, FaInstagram } from 'react-icons/fa'
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import type { SiteSettings } from "@/types/payload"
import { getMediaUrl } from "@/types/payload"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n-context"
import { buildCloudinaryVideo, buildCloudinaryVideoPoster } from "@/lib/cloudinary/urls"

interface MediaSource {
  url: string
  mimeType?: string
  cloudinaryPublicId?: string
  cloudinaryResourceType?: 'image' | 'video' | 'raw'
}

interface DJHeroProps {
  siteSettings?: SiteSettings | null
  heroDesktopMedia?: MediaSource | null
  heroMobileMedia?: MediaSource | null
  heroOverlayOpacity?: number
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  soundcloud: FaSoundcloud,
  spotify: FaSpotify,
  tiktok: FaTiktok,
}

function isVideo(media: MediaSource | null | undefined): boolean {
  if (!media?.url) return false
  if (media.cloudinaryResourceType === 'video') return true
  if (media.mimeType?.startsWith('video/')) return true
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']
  return videoExtensions.some(ext => media.url.toLowerCase().includes(ext))
}

function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('autoplay', '')
    video.removeAttribute('controls')

    let cancelled = false

    const tryPlay = () => {
      if (cancelled || !video) return
      const p = video.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay bloqueado — registra listeners de gesto do usuário e tenta de novo
          attachGestureListeners()
        })
      }
    }

    const gestureEvents: (keyof DocumentEventMap)[] = [
      'touchstart',
      'touchend',
      'click',
      'pointerdown',
      'keydown',
      'scroll',
    ]

    const onGesture = () => {
      tryPlay()
    }

    let listenersAttached = false
    const attachGestureListeners = () => {
      if (listenersAttached) return
      listenersAttached = true
      gestureEvents.forEach((ev) => {
        document.addEventListener(ev, onGesture, { passive: true, capture: true })
      })
    }
    const detachGestureListeners = () => {
      if (!listenersAttached) return
      listenersAttached = false
      gestureEvents.forEach((ev) => {
        document.removeEventListener(ev, onGesture, { capture: true } as EventListenerOptions)
      })
    }

    const onPlaying = () => {
      detachGestureListeners()
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }

    video.addEventListener('loadedmetadata', tryPlay)
    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('playing', onPlaying)
    document.addEventListener('visibilitychange', onVisibility)

    // Tentativas escalonadas (alguns browsers liberam autoplay um pouco depois do load)
    const timers = [0, 100, 400, 1000, 2500].map((ms) => window.setTimeout(tryPlay, ms))

    tryPlay()

    return () => {
      cancelled = true
      timers.forEach((t) => window.clearTimeout(t))
      video.removeEventListener('loadedmetadata', tryPlay)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('playing', onPlaying)
      document.removeEventListener('visibilitychange', onVisibility)
      detachGestureListeners()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
    />
  )
}

export function DJHero({ siteSettings, heroDesktopMedia, heroMobileMedia, heroOverlayOpacity = 40 }: DJHeroProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useI18n()

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

  const currentMedia = isMobile
    ? (heroMobileMedia?.url ? heroMobileMedia : heroDesktopMedia)
    : heroDesktopMedia

  const renderBackground = () => {
    if (!currentMedia?.url) return null

    if (isVideo(currentMedia)) {
      const videoSrc = currentMedia.cloudinaryPublicId
        ? (buildCloudinaryVideo(currentMedia.cloudinaryPublicId) || currentMedia.url)
        : currentMedia.url
      const posterSrc = currentMedia.cloudinaryPublicId
        ? buildCloudinaryVideoPoster(currentMedia.cloudinaryPublicId) || undefined
        : undefined
      return <HeroVideo src={videoSrc} poster={posterSrc} />
    }

    return (
      <Image
        src={currentMedia.url}
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />
    )
  }

  return (
    <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden border-0">
      {currentMedia?.url && (
        <div className="absolute inset-0 z-0">
          {renderBackground()}
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: heroOverlayOpacity / 100 }}
          />
        </div>
      )}

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

      <div className="relative z-30 w-full flex items-center justify-center min-h-screen">
        <div className="text-center px-6 py-32">
          <h2 className="!text-[24px] md:!text-[24px] uppercase tracking-wider text-white opacity-80">{t("hero.listening")}</h2>
          <h1 className="mt-4 text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white">DJ CALU</h1>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div className="hidden sm:flex w-6 h-10 border-2 border-secondary/40 rounded-full items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
        <div className="flex sm:hidden items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
