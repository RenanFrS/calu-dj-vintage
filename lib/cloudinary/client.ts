import { v2 as cloudinary } from 'cloudinary'

let configured = false

/**
 * Configura o SDK do Cloudinary.
 *
 * Suporta duas formas:
 * 1. CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME  (formato oficial)
 * 2. Variáveis individuais: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * Quando `CLOUDINARY_URL` está presente, o SDK detecta automaticamente sem precisar de `config()`.
 */
export function getCloudinary() {
  if (!configured) {
    if (!process.env.CLOUDINARY_URL) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })
    } else {
      // Garante secure=true mesmo quando lendo do CLOUDINARY_URL
      cloudinary.config({ secure: true })
    }
    configured = true
  }
  return cloudinary
}

export function getCloudName(): string {
  if (process.env.CLOUDINARY_CLOUD_NAME) return process.env.CLOUDINARY_CLOUD_NAME
  if (process.env.CLOUDINARY_URL) {
    const match = process.env.CLOUDINARY_URL.match(/@([^/?#]+)/)
    if (match) return match[1]
  }
  return ''
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  )
}

export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'calu-dj'

export function resourceTypeFromMime(mime: string | undefined): 'image' | 'video' | 'raw' {
  if (!mime) return 'raw'
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return 'raw'
}

export function stripExt(filename: string): string {
  const dot = filename.lastIndexOf('.')
  return dot === -1 ? filename : filename.slice(0, dot)
}
