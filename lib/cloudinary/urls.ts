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

interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Constrói uma URL Cloudinary aplicando um recorte (valores em 0-1 relativos à imagem original).
 * Usa `c_crop` com coordenadas fracionárias suportadas nativamente pelo Cloudinary.
 */
export function buildCloudinaryImageCropped(
  publicId: string,
  crop: CropRect | null | undefined,
  extraTransforms = 'f_auto,q_auto',
): string {
  if (!CLOUD_NAME || !publicId) return ''
  if (!crop || !isValidCrop(crop)) {
    return buildCloudinaryImage(publicId, extraTransforms)
  }
  const cropPart = `c_crop,x_${fmt(crop.x)},y_${fmt(crop.y)},w_${fmt(crop.width)},h_${fmt(crop.height)}`
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${cropPart}/${extraTransforms}/${publicId}`
}

function fmt(n: number): string {
  // Cloudinary aceita até 4 casas para fracionários
  return n.toFixed(4).replace(/\.?0+$/, '')
}

function isValidCrop(crop: CropRect): boolean {
  if (
    typeof crop.x !== 'number' ||
    typeof crop.y !== 'number' ||
    typeof crop.width !== 'number' ||
    typeof crop.height !== 'number'
  ) return false

  // Todos os valores precisam ser fracionários no intervalo [0, 1]
  if (crop.x < 0 || crop.x > 1) return false
  if (crop.y < 0 || crop.y > 1) return false
  if (crop.width <= 0 || crop.width > 1) return false
  if (crop.height <= 0 || crop.height > 1) return false

  // O recorte precisa caber dentro da imagem (com pequena tolerância para arredondamentos)
  const EPS = 0.001
  if (crop.x + crop.width > 1 + EPS) return false
  if (crop.y + crop.height > 1 + EPS) return false

  // Recorte que cobre a imagem inteira não precisa de transformação
  if (crop.x === 0 && crop.y === 0 && crop.width >= 1 && crop.height >= 1) return false

  return true
}

/**
 * Converte um crop (0-1) em CSS object-position + scale para fallback quando não há Cloudinary.
 * Centro do crop como object-position e zoom como inverso de width/height.
 */
export function cropToCssPosition(crop: CropRect | null | undefined): {
  objectPosition: string
  transform?: string
} {
  if (!crop || !isValidCrop(crop)) {
    return { objectPosition: 'center center' }
  }
  // Pega o centro do crop (limitado a 0-100%)
  const cx = Math.min(100, Math.max(0, (crop.x + crop.width / 2) * 100))
  const cy = Math.min(100, Math.max(0, (crop.y + crop.height / 2) * 100))
  return {
    objectPosition: `${cx.toFixed(2)}% ${cy.toFixed(2)}%`,
  }
}

/**
 * URL "delivery" direta para vídeo (arquivo mp4/webm), útil para `<video>` tradicional.
 */
export function buildCloudinaryVideo(publicId: string, transforms = 'f_auto,q_auto'): string {
  if (!CLOUD_NAME || !publicId) return ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${publicId}.mp4`
}
