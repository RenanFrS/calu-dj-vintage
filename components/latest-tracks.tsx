"use client"

import { Music2, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { motion } from "framer-motion"
import React from "react"
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-cards"

import { cn } from "@/lib/utils"
import type { Set } from "@/types/payload"
import { getMediaUrl } from "@/types/payload"
import { Card } from "@/components/ui/card"

interface LatestTracksProps {
  sets?: Set[]
}

// Helper para extrair o ID do vídeo de uma URL do YouTube
function extractYouTubeVideoId(url: string | undefined): string {
  if (!url) return ''
  
  // Padrões de URL do YouTube:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/v/VIDEO_ID
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Caso seja apenas o ID
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return ''
}

export function LatestTracks({ sets }: LatestTracksProps) {
  const tracks = sets || []
  
  // Mapear tracks para o formato esperado pelo carousel
  // Filtrar apenas os que têm thumbnail válida
  const carouselImages = tracks
    .map(t => {
      const customThumbnail = getMediaUrl(t.thumbnail)
      const videoId = extractYouTubeVideoId(t.videoUrl)
      const thumbnailSrc = customThumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '')

      return {
        src: thumbnailSrc,
        alt: t.title,
        videoId: videoId,
        videoUrl: t.videoUrl || '',
      }
    })
    .filter(img => img.src) // Remove itens sem thumbnail válida

  return (
    <section id="music" className="py-24 px-4 relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #192C66 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance text-secondary font-serif">
            {"Últimos Sets!"}
          </h2>
          <p className="text-xl text-muted-foreground">{"Ouça meus sets mais recentes"}</p>
        </div>

        {tracks.length === 0 ? (
          <div className="max-w-md mx-auto">
            <Card className="p-12 text-center border-2 border-dashed border-secondary/30 bg-card/50">
              <p className="text-xl text-muted-foreground">Configure no seu painel de admin!</p>
              <p className="text-sm text-muted-foreground mt-2">Adicione sets na coleção "Sets"</p>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center px-8">
            <Carousel_003 className="" images={carouselImages} showPagination loop autoplay />
          </div>
        )}
      </div>
    </section>
  )
}
const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}: {
  images: { src: string; alt: string; videoId: string; videoUrl: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_003 {
    width: 100%;
    height: 350px;
    padding-bottom: 50px !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
  }

  .swiper-pagination-bullet {
    background-color: #000 !important;
  }

`;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-4xl px-5", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 1500,
                  disableOnInteraction: true,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="Carousal_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="">
              <a href={image.videoUrl || `https://www.youtube.com/watch?v=${image.videoId}`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${image.alt} no YouTube`} className="block h-full w-full">
                <img
                  className="h-full w-full object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </a>
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};