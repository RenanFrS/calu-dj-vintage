'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface MediaSource {
  url: string
  mimeType?: string
  /** URL de uma imagem para usar como poster/fallback quando o vídeo não pode iniciar (ex: Low Power Mode) */
  posterUrl?: string
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
  
  const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/mov']
  if (media.mimeType && videoMimeTypes.includes(media.mimeType)) {
    return true
  }
  
  // Fallback: verificar extensão
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']
  const url = media.url.toLowerCase()
  return videoExtensions.some(ext => url.includes(ext))
}

// Detecta se a mídia é um GIF
function isGif(media: MediaSource | null | undefined): boolean {
  if (!media?.url) return false
  
  if (media.mimeType === 'image/gif') {
    return true
  }
  
  return media.url.toLowerCase().includes('.gif')
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

    // Garantir autoplay mesmo em dispositivos móveis (especialmente Safari/iOS)
    const playVideo = async () => {
      try {
        // Forçar atributos necessários para autoplay no Safari/iOS
        // defaultMuted é crucial para Safari permitir autoplay
        video.defaultMuted = true
        video.muted = true
        video.playsInline = true
        video.loop = true
        video.autoplay = true
        
        // Aguardar o vídeo estar pronto para tocar
        if (video.readyState >= 2) {
          await video.play()
        } else {
          // Aguardar o vídeo carregar o suficiente
          video.addEventListener('canplay', async () => {
            try {
              await video.play()
            } catch (e) {
              // Silenciosamente ignorar erro de autoplay
            }
          }, { once: true })
        }
      } catch (error) {
        // Lidar silenciosamente com erro de "Low Power Mode" ou outras restrições
        // Não logar no console para não poluir em produção
        if (error instanceof Error && error.name !== 'AbortError') {
          // Tentar novamente após interação do usuário
          const retryPlay = () => {
            video.play().catch(() => {})
            document.removeEventListener('click', retryPlay)
            document.removeEventListener('touchstart', retryPlay)
          }
          document.addEventListener('click', retryPlay, { once: true })
          document.addEventListener('touchstart', retryPlay, { once: true })
        }
      }
    }

    playVideo()

    // Replay quando o vídeo terminar (fallback para loop)
    const handleEnded = () => {
      video.currentTime = 0
      video.play().catch(() => {})
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [src])

  // Detectar tipo de vídeo pela extensão
  const getVideoType = (url: string): string => {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes('.webm')) return 'video/webm'
    if (lowerUrl.includes('.ogg') || lowerUrl.includes('.ogv')) return 'video/ogg'
    if (lowerUrl.includes('.mov')) return 'video/quicktime'
    return 'video/mp4'
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      className={`w-full h-full object-cover ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <source src={src} type={getVideoType(src)} />
      Seu navegador não suporta vídeos.
    </video>
  )
}

// Componente de imagem/GIF
function ImageBackground({ 
  src, 
  priority = false,
  className = '' 
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
      className={`object-cover ${className}`}
      priority={priority}
      unoptimized={src.toLowerCase().includes('.gif')} // Não otimizar GIFs para manter animação
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Usa mobile se disponível, senão fallback para desktop
  const mobileSource = mobileMedia?.url ? mobileMedia : desktopMedia
  const desktopSource = desktopMedia

  const renderMedia = (media: MediaSource | null | undefined, visibilityClass: string) => {
    if (!media?.url) return null

    if (isVideo(media)) {
      return (
        <div className={`absolute inset-0 ${visibilityClass}`}>
          <VideoBackground src={media.url} poster={media.posterUrl} />
        </div>
      )
    }

    return (
      <div className={`absolute inset-0 ${visibilityClass}`}>
        <ImageBackground 
          src={media.url} 
          priority={priority}
        />
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
  media: { url?: string; mimeType?: string } | string | null | undefined,
  posterUrl?: string
): MediaSource | null {
  if (!media) return null
  
  if (typeof media === 'string') {
    return { url: media, posterUrl }
  }
  
  if (media.url) {
    return {
      url: media.url,
      mimeType: media.mimeType,
      posterUrl
    }
  }
  
  return null
}
