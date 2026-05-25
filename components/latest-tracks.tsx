"use client"

import { ChevronLeftIcon, ChevronRightIcon, Play } from "lucide-react"
import { motion } from "framer-motion"
import React, { useRef, useState } from "react"
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"

import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n-context"
import type { Set } from "@/types/payload"
import { getMediaUrl } from "@/types/payload"
import { Card } from "@/components/ui/card"

interface LatestTracksProps {
  sets?: Set[]
}

interface CarouselItem {
  title: string
  featuring?: string
  thumbnail: string
  thumbnailFallback?: string
  videoId: string
  videoUrl: string
}

function extractYouTubeVideoId(url: string | undefined): string {
  if (!url) return ''
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return ''
}

export function LatestTracks({ sets }: LatestTracksProps) {
  const { t } = useI18n()
  const tracks = sets || []

  const carouselItems: CarouselItem[] = tracks
    .map((track) => {
      const customThumbnail = getMediaUrl(track.thumbnail)
      const videoId = extractYouTubeVideoId(track.videoUrl)
      const ytMaxRes = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
      const ytHqRes = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''

      return {
        title: track.title,
        featuring: track.featuring || undefined,
        thumbnail: customThumbnail || ytMaxRes,
        thumbnailFallback: customThumbnail ? undefined : ytHqRes,
        videoId,
        videoUrl: track.videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''),
      }
    })
    .filter((item) => item.thumbnail && item.videoUrl)

  return (
    <section id="music" className="py-24 px-4 relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #192C66 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance text-secondary font-serif">
            {t('sets.title')}
          </h2>
          <p className="text-xl text-muted-foreground">{t('sets.subtitle')}</p>
        </div>

        {carouselItems.length === 0 ? (
          <div className="max-w-md mx-auto">
            <Card className="p-12 text-center border-2 border-dashed border-secondary/30 bg-card/50">
              <p className="text-xl text-muted-foreground">{t('configure.admin')}</p>
            </Card>
          </div>
        ) : (
          <TracksCarousel items={carouselItems} />
        )}
      </div>
    </section>
  )
}

function TracksCarousel({ items }: { items: CarouselItem[] }) {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="relative w-full max-w-6xl mx-auto px-2 sm:px-8"
    >
      <style>{`
        .tracks-carousel {
          padding: 12px 0 60px !important;
          overflow: visible !important;
        }
        .tracks-carousel .swiper-slide {
          width: 320px;
          height: auto;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        @media (min-width: 640px) {
          .tracks-carousel .swiper-slide { width: 420px; }
        }
        @media (min-width: 1024px) {
          .tracks-carousel .swiper-slide { width: 520px; }
        }
        .tracks-carousel .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.5;
        }
        .tracks-carousel .swiper-pagination {
          bottom: 0 !important;
        }
        .tracks-carousel .swiper-pagination-bullet {
          background-color: var(--secondary, #f5deb3) !important;
          opacity: 0.4;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .tracks-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          width: 28px;
          border-radius: 4px;
        }
      `}</style>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        effect="coverflow"
        grabCursor
        slidesPerView="auto"
        centeredSlides
        loop={items.length > 2}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        coverflowEffect={{
          rotate: 25,
          stretch: 0,
          depth: 180,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        className="tracks-carousel"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <TrackCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <CarouselButton
        direction="prev"
        onClick={() => swiperRef.current?.slidePrev()}
        className="left-0 sm:-left-2"
      />
      <CarouselButton
        direction="next"
        onClick={() => swiperRef.current?.slideNext()}
        className="right-0 sm:-right-2"
      />
    </motion.div>
  )
}

function TrackCard({ item }: { item: CarouselItem }) {
  const [src, setSrc] = useState(item.thumbnail)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    if (!failed && item.thumbnailFallback) {
      setSrc(item.thumbnailFallback)
      setFailed(true)
    }
  }

  return (
    <a
      href={item.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir ${item.title} no YouTube`}
      className="group block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-2xl"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-secondary/20 bg-black shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:border-secondary/60 group-hover:shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={item.title}
          onError={handleError}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Gradient overlay para legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Botão de play central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 shadow-lg shadow-red-600/40 ring-4 ring-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600 sm:h-20 sm:w-20">
            <Play className="ml-1 h-7 w-7 fill-white text-white sm:h-9 sm:w-9" />
          </div>
        </div>

        {/* Badge YouTube */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          YouTube
        </div>

        {/* Título + featuring na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <h3 className="font-serif text-lg font-bold leading-tight text-white drop-shadow-md sm:text-xl line-clamp-2">
            {item.title}
          </h3>
          {item.featuring && (
            <p className="mt-1 text-sm text-white/80 line-clamp-1">{item.featuring}</p>
          )}
        </div>
      </div>
    </a>
  )
}

function CarouselButton({
  direction,
  onClick,
  className,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  className?: string
}) {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Anterior' : 'Próximo'}
      className={cn(
        'absolute top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full',
        'bg-background/70 text-secondary backdrop-blur-md border-2 border-secondary/40',
        'transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:scale-110',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary',
        'shadow-lg',
        className,
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  )
}
