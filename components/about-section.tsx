"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import type { About } from "@/types/payload"
import { getMediaUrl } from "@/types/payload"

interface AboutSectionProps {
  about: About | null
}

export function AboutSection({ about }: AboutSectionProps) {
  const { language } = useI18n()

  if (!about) {
    return (
      <section id="about" className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Configure no seu painel de admin!</p>
          </div>
        </div>
      </section>
    )
  }

  // Selecionar conteúdo baseado no idioma
  const getLocalizedContent = () => {
    switch (language) {
      case 'en':
        return {
          title: about.title_en || about.title_pt || 'DJ Calu',
          subtitle: about.subtitle_en || about.subtitle_pt,
          paragraphs: about.paragraphs_en?.length ? about.paragraphs_en : about.paragraphs_pt,
          tagline: about.tagline_en || about.tagline_pt,
        }
      case 'fr':
        return {
          title: about.title_fr || about.title_pt || 'DJ Calu',
          subtitle: about.subtitle_fr || about.subtitle_pt,
          paragraphs: about.paragraphs_fr?.length ? about.paragraphs_fr : about.paragraphs_pt,
          tagline: about.tagline_fr || about.tagline_pt,
        }
      default: // 'pt'
        return {
          title: about.title_pt || 'DJ Calu',
          subtitle: about.subtitle_pt,
          paragraphs: about.paragraphs_pt,
          tagline: about.tagline_pt,
        }
    }
  }

  const content = getLocalizedContent()
  const profileImageUrl = getMediaUrl(about.profileImage)

  return (
    <section id="about" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-white mb-4">
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0">
                {content.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center">
            {profileImageUrl && (
              <div className="w-72 h-72 md:w-96 md:h-96 relative rounded-full overflow-hidden shadow-2xl">
                <Image 
                  src={profileImageUrl} 
                  alt={content.title || "Perfil"} 
                  fill 
                  sizes="(max-width: 768px) 18rem, 24rem" 
                  className="object-cover" 
                />
              </div>
            )}
          </div>
        </div>

        {content.paragraphs && content.paragraphs.length > 0 && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300 text-[17px] leading-relaxed max-w-5xl">
              {content.paragraphs.map((paragraph, index) => (
                <div key={paragraph.id || index}>
                  <p>{paragraph.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.tagline && (
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-2xl md:text-3xl lg:text-4xl text-white max-w-2xl mx-auto flex items-center gap-4 justify-center">
              <span className="leading-tight">{content.tagline}</span>
              <Heart className="flex-shrink-0 w-6 h-6" aria-hidden="false" aria-label="coração" />
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
