'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { buildCloudinaryVideo, buildCloudinaryVideoPoster } from '@/lib/cloudinary/urls'

export interface MediaSource {
  url: string
  mimeType?: string
  /** URL de uma imagem para usar como poster/fallback quando o vídeo não pode iniciar (ex: Low Power Mode) */
  posterUrl?: string
  /** publicId do Cloudinary (quando aplicável) */
  cloudinaryPublicId?: string
  /** Tipo de recurso no Cloudinary (image, video, raw) */
  cloudinaryResourceType?: 'image' | 'video' | 'raw'
}

interface DynamicBackgroundProps {
  /** Mídia para desktop (imagem, GIF ou vídeo) */
  desktopMedia?: MediaSource | null
  /** Mídia para mobile (imagem, GIF ou vídeo) */
  mobileMedia?: MediaSource | null
  /** Overlay escuro sobre o background (0-100) */
  overlayOpacity?: number
  /** Classe CSS adicional */
  className?: string
  /** Prioridade de carregamento para imagens */
  priority?: boolean
}

// Detecta se a mídia é um vídeo baseado no mimeType ou extensão
function isVideo(media: MediaSource | null | undefined): boolean {
  if (!media?.url) return false
  if (media.cloudinaryResourceType === 'video') return true

  const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/mov']
  if (media.mimeType && videoMimeTypes.includes(media.mimeType)) {
    return true
  }

  // Fallback: verificar extensão
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']
  const url = media.url.toLowerCase()
  return videoExtensions.some(ext => url.includes(ext))
}

// Componente de vídeo com autoplay, loop e muted
function VideoBackground({
  src,
  poster,
  className = ''
}: {
  src: string
  poster?: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

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

    const onEnded = () => {
      video.currentTime = 0
      tryPlay()
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }

    video.addEventListener('loadedmetadata', tryPlay)
    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', onEnded)
    document.addEventListener('visibilitychange', onVisibility)

    const timers = [0, 100, 400, 1000, 2500].map((ms) => window.setTimeout(tryPlay, ms))
    tryPlay()

    return () => {
      cancelled = true
      timers.forEach((t) => window.clearTimeout(t))
      video.removeEventListener('loadedmetadata', tryPlay)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', onEnded)
      document.removeEventListener('visibilitychange', onVisibility)
      detachGestureListeners()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      className={`w-full h-full object-cover select-none ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}

// Componente de imagem/GIF
function ImageBackground({
  src,
  priority = false,
  className = '',
}: {
  src: string
  priority?: boolean
  className?: string
}) {
  return (
    <Image
      src={src}
      alt="Background"
      fill
      sizes="100vw"
      className={`object-cover object-center ${className}`}
      style={{ objectPosition: 'center center' }}
      priority={priority}
      unoptimized={src.toLowerCase().includes('.gif')}
    />
  )
}

export function DynamicBackground({
  desktopMedia,
  mobileMedia,
  overlayOpacity = 40,
  className = '',
  priority = true
}: DynamicBackgroundProps) {
  // Usa mobile se disponível, senão fallback para desktop
  const mobileSource = mobileMedia?.url ? mobileMedia : desktopMedia
  const desktopSource = desktopMedia

  const renderMedia = (media: MediaSource | null | undefined, visibilityClass: string) => {
    if (!media?.url) return null

    if (isVideo(media)) {
      const videoSrc = media.cloudinaryPublicId
        ? buildCloudinaryVideo(media.cloudinaryPublicId) || media.url
        : media.url
      // Poster automático do primeiro frame (fallback para iOS Low Power Mode etc.)
      const posterSrc =
        media.posterUrl ||
        (media.cloudinaryPublicId
          ? buildCloudinaryVideoPoster(media.cloudinaryPublicId) || undefined
          : undefined)
      return (
        <div className={`absolute inset-0 ${visibilityClass}`}>
          <VideoBackground src={videoSrc} poster={posterSrc} />
        </div>
      )
    }

    return (
      <div className={`absolute inset-0 ${visibilityClass}`}>
        <ImageBackground src={media.url} priority={priority} />
      </div>
    )
  }

  // Se não tem nenhuma mídia, mostra gradient padrão
  if (!desktopSource?.url && !mobileSource?.url) {
    return (
      <div className={`fixed inset-0 -z-20 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
        <div 
          className="absolute inset-0 bg-black pointer-events-none" 
          style={{ opacity: overlayOpacity / 100 }}
        />
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 -z-20 overflow-hidden pointer-events-none ${className}`}>
      {/* Desktop */}
      {renderMedia(desktopSource, 'hidden md:block')}
      
      {/* Mobile */}
      {renderMedia(mobileSource, 'md:hidden')}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none" 
        style={{ opacity: overlayOpacity / 100 }}
      />
    </div>
  )
}

// Helper para converter Media do Payload para MediaSource
export function toMediaSource(
  media:
    | {
        url?: string
        mimeType?: string
        cloudinaryPublicId?: string
        cloudinaryResourceType?: 'image' | 'video' | 'raw'
        cloudinarySecureUrl?: string
      }
    | string
    | null
    | undefined,
  posterUrl?: string,
): MediaSource | null {
  if (!media) return null

  if (typeof media === 'string') {
    if (media.startsWith('http://') || media.startsWith('https://') || media.startsWith('/')) {
      return { url: media, posterUrl }
    }
    return null
  }

  const url = media.cloudinarySecureUrl || media.url
  if (!url) return null

  return {
    url,
    mimeType: media.mimeType,
    posterUrl,
    cloudinaryPublicId: media.cloudinaryPublicId,
    cloudinaryResourceType: media.cloudinaryResourceType,
  }
}
