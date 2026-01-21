"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, Mail, Twitter } from "lucide-react"
import { FaTiktok, FaSpotify, FaYoutube, FaSoundcloud, FaInstagram } from 'react-icons/fa';
import Image from "next/image"
import { useState, useEffect } from "react"
import type { SiteSettings, SocialLink } from "@/types/payload"
import { getMediaUrl } from "@/types/payload"

interface DJHeroProps {
  siteSettings?: SiteSettings | null
}

// Mapeamento de ícones por plataforma
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  soundcloud: FaSoundcloud,
  spotify: FaSpotify,
  tiktok: FaTiktok,
}

// Links de redes sociais padrão (fallback)
const defaultSocialLinks: SocialLink[] = [
  { platform: 'instagram', url: 'https://www.instagram.com/caluzete/', enabled: true },
  { platform: 'youtube', url: 'https://youtube.com', enabled: true },
  { platform: 'soundcloud', url: 'https://soundcloud.com/calu-zete', enabled: true },
  { platform: 'spotify', url: 'https://open.spotify.com/intl-pt/artist/1kqlYPWo8aVtw8a7yovJgz?si=Wdfs7ca2TLeqYDWUAP8hug', enabled: true },
]

export function DJHero({ siteSettings }: DJHeroProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Usar links do Payload ou fallback
  const socialLinks = (siteSettings?.socialLinks?.filter(link => link.enabled !== false) || defaultSocialLinks)
  const logoUrl = getMediaUrl(siteSettings?.logo) || "/logo/logo-calu.png"
  const logoAlt = siteSettings?.logoAlt || "Calu DJ Logo"

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden bg-background border-0">
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
                {"Música"}
              </a>
              <a href="#tour" className="text-foreground hover:text-primary transition-colors font-medium uppercase text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer px-3 py-2 rounded">
                {"Agenda"}
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium uppercase text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer px-3 py-2 rounded">
                {"Sobre"}
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium uppercase text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:ring-2 hover:ring-white hover:ring-offset-2 cursor-pointer px-3 py-2 rounded">
                {"Contato"}
              </a>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={140}
                height={44}
                className="object-contain"
                priority
              />
            </div>

            {/* Right - desktop icons + mobile menu button */}
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
              <a href="#music" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">Música</a>
              <a href="#tour" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">Agenda</a>
              <a href="#about" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">Sobre</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="block text-foreground hover:text-primary px-3 py-2 rounded focus-visible:ring-2 focus-visible:ring-white">Contato</a>
            </div>
          )}
        </nav>
      </header>

      {/* Hero-specific background video (place /public/video/hero.mp4) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none border-0">
        <iframe
          loading="eager"
          src="https://player.vimeo.com/video/1150705874?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1&amp;loop=1"
          title="Hero background video"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          className="w-full h-full absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none border-0" />
      </div>

      {/* Content - simplified centered hero (header/nav kept) */}
      <div className="relative z-30 w-full flex items-center justify-center min-h-screen">
        <div className="text-center px-6 py-32">
          <h2 className="!text-[24px] md:!text-[24px] uppercase tracking-wider text-white opacity-80">Você está ouvindo</h2>
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
