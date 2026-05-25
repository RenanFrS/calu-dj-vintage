/**
 * Helpers para extrair uma região recortada de uma imagem usando canvas
 * (executado no navegador).
 */

export interface CropPixels {
  x: number
  y: number
  width: number
  height: number
}

export function loadCrossOriginImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Falha ao carregar imagem (verifique CORS)'))
    img.src = src
  })
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Falha ao converter canvas em Blob'))
      },
      type,
      quality,
    )
  })
}

/**
 * Extrai uma região da imagem como Blob.
 * `pixels` deve ser em coordenadas absolutas da imagem original.
 */
export async function extractCropAsBlob(
  src: string,
  pixels: CropPixels,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality = 0.92,
): Promise<Blob> {
  const img = await loadCrossOriginImage(src)
  const width = Math.max(1, Math.round(pixels.width))
  const height = Math.max(1, Math.round(pixels.height))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não foi possível obter o contexto 2D do canvas')

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
  }

  ctx.drawImage(
    img,
    Math.max(0, Math.round(pixels.x)),
    Math.max(0, Math.round(pixels.y)),
    width,
    height,
    0,
    0,
    width,
    height,
  )

  return canvasToBlob(canvas, mimeType, quality)
}
