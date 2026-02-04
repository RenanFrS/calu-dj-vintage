'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface MediaSource {
  url: string
  mimeType?: string
}

interface SpotifySectionProps {
  desktopMedia?: MediaSource | null
  mobileMedia?: MediaSource | null
}

// Detecta se a mídia é um vídeo
function isVideo(media: MediaSource | null | undefined): boolean {
  if (!media?.url) return false
  const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/mov']
  if (media.mimeType && videoMimeTypes.includes(media.mimeType)) return true
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']
  return videoExtensions.some(ext => media.url.toLowerCase().includes(ext))
}

function VideoBackground({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const playVideo = async () => {
      try {
        video.muted = true
        video.playsInline = true
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
      className="w-full h-full object-cover"
      style={{ pointerEvents: 'none' }}
    >
      <source src={src} type="video/mp4" />
      <source src={src} type="video/webm" />
    </video>
  )
}

export function SpotifySection({ desktopMedia, mobileMedia }: SpotifySectionProps) {
  const mobileSource = mobileMedia?.url ? mobileMedia : desktopMedia
  const hasBackground = desktopMedia?.url || mobileSource?.url

  const renderMedia = (media: MediaSource | null | undefined, visibilityClass: string) => {
    if (!media?.url) return null
    if (isVideo(media)) {
      return (
        <div className={`absolute inset-0 ${visibilityClass}`}>
          <VideoBackground src={media.url} />
        </div>
      )
    }
    return (
      <div className={`absolute inset-0 ${visibilityClass}`}>
        <Image
          src={media.url}
          alt="Background"
          fill
          className="object-cover"
          unoptimized={media.url.toLowerCase().includes('.gif')}
        />
      </div>
    )
  }

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden">
      {/* Background dinâmico */}
      {hasBackground && (
        <div className="absolute inset-0 z-0">
          {renderMedia(desktopMedia, 'hidden md:block')}
          {renderMedia(mobileSource, 'md:hidden')}
        </div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left side - Text and Spotify logo */}
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-serif drop-shadow-2xl">
              THIS IS<br />CALU
            </h2>
        
          </div>

          {/* Right side - Spotify Embed */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
             <iframe data-testid="embed-iframe" style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/artist/1kqlYPWo8aVtw8a7yovJgz?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}