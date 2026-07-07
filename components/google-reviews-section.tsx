'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { Star, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, type Language } from '@/lib/i18n-context'
import { getMediaUrl } from '@/types/payload'
import { GOOGLE_REVIEW_URL, GOOGLE_PLACE_URL } from '@/lib/site'
import type { Review, Media } from '@/types/payload'

interface GoogleReviewsSectionProps {
  reviews: Review[]
}

// Paleta inspirada nos avatares coloridos do Google (fallback quando não há foto).
const AVATAR_COLORS = ['#1a73e8', '#d93025', '#188038', '#e37400', '#9334e6', '#12b5cb', '#c5221f']

function colorFor(name: string): string {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function relativeTime(dateStr: string | undefined, lang: Language): string {
  if (!dateStr) return ''
  const then = new Date(dateStr).getTime()
  if (Number.isNaN(then)) return ''
  const diff = then - Date.now() // negativo = passado
  const abs = Math.abs(diff)
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000_000],
    ['month', 2_592_000_000],
    ['week', 604_800_000],
    ['day', 86_400_000],
  ]
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'day') {
      return rtf.format(Math.round(diff / ms), unit)
    }
  }
  return ''
}

/** Linha de 5 estrelas com preenchimento fracionário (para a média). */
function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="inline-flex" role="img" aria-label={`${value} de 5 estrelas`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-black/15" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-[#fbbc04]" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

function Avatar({ review }: { review: Review }) {
  const src = getMediaUrl(review.avatar as Media | string | undefined)
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={review.authorName}
        loading="lazy"
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-medium text-white"
      style={{ backgroundColor: colorFor(review.authorName) }}
      aria-hidden="true"
    >
      {initialOf(review.authorName)}
    </div>
  )
}

function ReviewCard({ review, lang }: { review: Review; lang: Language }) {
  const when = relativeTime(review.date, lang)
  return (
    <figure className="relative flex flex-col gap-3 rounded-2xl bg-white p-6 text-neutral-900 shadow-xl ring-1 ring-black/5">
      <FcGoogle className="absolute right-5 top-5 h-5 w-5" aria-hidden="true" />
      <figcaption className="flex items-center gap-3 pr-7">
        <Avatar review={review} />
        <div className="min-w-0">
          <p className="truncate font-medium leading-tight text-neutral-900">{review.authorName}</p>
          {when && <p className="text-xs text-neutral-500">{when}</p>}
        </div>
      </figcaption>
      <Stars value={review.rating} size={18} />
      <blockquote className="text-[15px] leading-relaxed text-neutral-700">{review.text}</blockquote>
    </figure>
  )
}

export function GoogleReviewsSection({ reviews }: GoogleReviewsSectionProps) {
  const { t, language } = useI18n()

  const count = reviews.length

  // Lista com rolagem própria: fades nas bordas indicam conteúdo acima/abaixo.
  const listRef = useRef<HTMLDivElement | null>(null)
  const [atTop, setAtTop] = useState(true)
  const [atBottom, setAtBottom] = useState(true)

  const updateScrollEdges = useCallback(() => {
    const el = listRef.current
    if (!el) return
    setAtTop(el.scrollTop <= 4)
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4)
  }, [])

  useEffect(() => {
    updateScrollEdges()
    window.addEventListener('resize', updateScrollEdges)
    return () => window.removeEventListener('resize', updateScrollEdges)
  }, [updateScrollEdges, count])
  const average = count > 0 ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / count : 0
  const averageLabel = average.toLocaleString(language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return (
    <section id="reviews" className="relative w-full overflow-hidden py-20 md:py-28">
      {/* Overlay para legibilidade sobre o background das seções */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Coluna esquerda — painel de informações (fixo ao rolar em telas grandes) */}
          <div>
            <div className="text-center lg:sticky lg:top-24 lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur">
                <FcGoogle className="h-5 w-5" />
                Google
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                {t('reviews.title')}
              </h2>
              <p className="mt-3 text-white/70">{t('reviews.subtitle')}</p>

              {count > 0 && (
                <div className="mt-6 flex flex-col items-center gap-2 lg:items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-white">{averageLabel}</span>
                    <Stars value={average} size={24} />
                  </div>
                  <p className="text-sm text-white/60">
                    {count} {count === 1 ? t('reviews.review') : t('reviews.reviews')}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white text-neutral-900 shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-white"
                >
                  <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                    <FcGoogle className="mr-2 h-5 w-5" />
                    {t('reviews.cta')}
                  </a>
                </Button>
                {count > 0 && (
                  <a
                    href={GOOGLE_PLACE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {t('reviews.viewAll')}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Coluna direita — feed com rolagem própria ou estado vazio */}
          {count > 0 ? (
            <div className="relative min-w-0 self-center">
              <div
                ref={listRef}
                onScroll={updateScrollEdges}
                aria-label={t('reviews.title')}
                className="max-h-[60vh] space-y-4 overflow-y-auto pr-3 md:space-y-6 lg:max-h-[70vh] [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {reviews.map((review, i) => (
                  <ReviewCard key={review.id || i} review={review} lang={language} />
                ))}
              </div>

              {/* Fades de borda — indicam que há mais avaliações acima/abaixo */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300 ${atTop ? 'opacity-0' : 'opacity-100'}`}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${atBottom ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
          ) : (
            <p className="self-start rounded-2xl border border-white/15 bg-white/5 px-6 py-8 text-center text-white/70 backdrop-blur">
              {t('reviews.empty')}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
