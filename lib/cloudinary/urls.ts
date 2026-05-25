/**
 * Helpers de URL do Cloudinary para uso no frontend.
 * Apenas o `cloud_name` é necessário, e é exposto via NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
 */

function parseCloudNameFromUrl(url: string | undefined): string {
  if (!url) return ''
  const match = url.match(/@([^/?#]+)/)
  return match ? match[1] : ''
}

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  parseCloudNameFromUrl(process.env.CLOUDINARY_URL) ||
  ''

interface VideoPlayerOptions {
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  fluid?: boolean
  poster?: string
  source_types?: ('mp4' | 'webm' | 'ogv')[]
}

/**
 * URL para o Video Player iframe do Cloudinary.
 * Docs: https://cloudinary.com/documentation/video_player_api_reference
 */
export function buildCloudinaryVideoIframe(publicId: string, options: VideoPlayerOptions = {}): string {
  if (!CLOUD_NAME || !publicId) return ''

  const params = new URLSearchParams()
  params.set('cloud_name', CLOUD_NAME)
  params.set('public_id', publicId)
  params.set('autoplay', String(options.autoplay ?? true))
  params.set('loop', String(options.loop ?? true))
  params.set('muted', String(options.muted ?? true))
  params.set('controls', String(options.controls ?? false))
  params.set('fluid', String(options.fluid ?? true))
  if (options.poster) params.set('poster', options.poster)
  if (options.source_types?.length) params.set('source_types', options.source_types.join(','))

  return `https://player.cloudinary.com/embed/?${params.toString()}`
}

/**
 * URL "delivery" para imagem com transformações.
 */
export function buildCloudinaryImage(publicId: string, transforms = 'f_auto,q_auto'): string {
  if (!CLOUD_NAME || !publicId) return ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

/**
 * URL "delivery" direta para vídeo (arquivo mp4/webm), útil para `<video>` tradicional.
 */
export function buildCloudinaryVideo(publicId: string, transforms = 'f_auto,q_auto'): string {
  if (!CLOUD_NAME || !publicId) return ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${publicId}.mp4`
}
