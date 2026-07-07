'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useField, useForm } from '@payloadcms/ui'
import Cropper, { type Area } from 'react-easy-crop'
import { extractCropAsBlob } from '@/lib/cloudinary/cropCanvas'

/**
 * Este componente substitui o campo de upload irmão por uma NOVA Mídia
 * recortada quando o usuário confirma o recorte. A imagem original permanece
 * na coleção Media e pode ser reutilizada em outros lugares.
 *
 * Fluxo:
 *  1. Usuário escolhe uma imagem no campo de upload acima.
 *  2. Clica em "Ajustar enquadramento" → abre modal com Cropper.
 *  3. Ajusta área de corte e clica em "Aplicar recorte".
 *  4. Aqui: lemos pixels via canvas → POST /api/media → recebemos nova Mídia
 *     → atualizamos o campo de upload (UPDATE no form) com o ID novo.
 *  5. Usuário salva o documento normalmente.
 *
 * O campo JSON `*Crop` continua existindo no schema apenas para compatibilidade
 * com dados antigos; o valor é zerado a cada nova operação.
 */

interface ImageCropFieldProps {
  path: string
  uploadFieldName: string
  defaultAspect?: number | null
}

interface MediaDoc {
  id: string
  url?: string | null
  cloudinarySecureUrl?: string | null
  cloudinaryPublicId?: string | null
  mimeType?: string | null
  filename?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

const ASPECT_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Livre', value: null },
  { label: '1:1 (quadrado)', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9 (paisagem)', value: 16 / 9 },
  { label: '9:16 (retrato)', value: 9 / 16 },
  { label: '21:9 (cinema)', value: 21 / 9 },
]

export default function ImageCropField({
  path,
  uploadFieldName,
  defaultAspect,
}: ImageCropFieldProps) {
  // Campo JSON (legado) — só usamos pra zerar
  const { setValue: setCropJson } = useField<unknown>({ path })

  // Hook do campo de upload irmão — usa setValue para garantir que o form é
  // marcado como modificado e o save persiste corretamente.
  const { value: rawUploadValue, setValue: setUploadValue } = useField<string | undefined>({
    path: uploadFieldName,
  })
  const uploadValue = typeof rawUploadValue === 'string' ? rawUploadValue : undefined

  const { setModified } = useForm()

  const [media, setMedia] = useState<MediaDoc | null>(null)
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState<number | null>(defaultAspect ?? null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  useEffect(() => {
    if (!uploadValue) {
      setMedia(null)
      return
    }
    let cancelled = false
    setLoadingMedia(true)
    fetch(`/api/media/${uploadValue}?depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc: MediaDoc | null) => {
        if (!cancelled) setMedia(doc)
      })
      .catch(() => {
        if (!cancelled) setMedia(null)
      })
      .finally(() => {
        if (!cancelled) setLoadingMedia(false)
      })
    return () => {
      cancelled = true
    }
  }, [uploadValue])

  const imageUrl = media?.cloudinarySecureUrl || media?.url || null
  const isImage = media?.mimeType?.startsWith('image/') ?? false

  // "Livre" usa a proporção natural da imagem: o recorte inicial cobre a
  // imagem inteira (react-easy-crop cai em 4/3 quando aspect é undefined).
  const naturalAspect =
    media?.width && media?.height ? media.width / media.height : undefined

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    if (!areaPixels || areaPixels.width <= 0 || areaPixels.height <= 0) return
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleOpen = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setAspect(defaultAspect ?? null)
    setCroppedAreaPixels(null)
    setErrorMessage(null)
    setOpen(true)
  }

  const handleConfirm = async () => {
    if (!imageUrl || !croppedAreaPixels) {
      setErrorMessage('Mova ou ajuste o recorte antes de aplicar.')
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    try {
      const sourceIsPng = (media?.mimeType || '').toLowerCase().includes('png')
      const outputMime = sourceIsPng ? 'image/png' : 'image/jpeg'
      const ext = sourceIsPng ? 'png' : 'jpg'

      const blob = await extractCropAsBlob(imageUrl, croppedAreaPixels, outputMime)

      const baseName = (media?.filename || 'imagem').replace(/\.[^.]+$/, '')
      const filename = `${baseName}-crop-${Date.now()}.${ext}`

      const altText = `${media?.alt || baseName} (recortado)`

      const formData = new FormData()
      formData.append('file', blob, filename)
      formData.append('_payload', JSON.stringify({ alt: altText }))

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Upload falhou (HTTP ${res.status}): ${text || 'sem detalhes'}`)
      }

      const payload = (await res.json()) as { doc?: { id?: string } }
      const newMediaId = payload?.doc?.id
      if (!newMediaId) throw new Error('Resposta do upload não retornou um ID válido.')

      // Atualiza o campo de upload com o ID da nova Mídia.
      // setValue dispara UPDATE e setModified internamente.
      setUploadValue(newMediaId)
      setModified(true)

      // Zera o campo legado de crop
      setCropJson(null)

      setOpen(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      setErrorMessage(msg)
      console.error('[ImageCropField] erro ao gerar imagem recortada:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!uploadValue) {
    return (
      <div className="field-type" style={containerStyle}>
        <Hint>Anexe uma imagem acima para habilitar o ajuste de enquadramento.</Hint>
      </div>
    )
  }

  if (loadingMedia) {
    return (
      <div className="field-type" style={containerStyle}>
        <Hint>Carregando mídia...</Hint>
      </div>
    )
  }

  if (!media || !imageUrl) {
    return (
      <div className="field-type" style={containerStyle}>
        <Hint>Não foi possível carregar a mídia selecionada.</Hint>
      </div>
    )
  }

  if (!isImage) {
    return (
      <div className="field-type" style={containerStyle}>
        <Hint>O ajuste de enquadramento só é aplicável a imagens (vídeos não são suportados).</Hint>
      </div>
    )
  }

  return (
    <div className="field-type" style={containerStyle}>
      <div style={previewWrapStyle}>
        <div style={previewBoxStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Mídia atual"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>
        <div style={previewMetaStyle}>
          <strong style={{ display: 'block', marginBottom: 4 }}>Enquadramento da imagem</strong>
          <span style={{ fontSize: 12, opacity: 0.75 }}>
            A imagem acima é a versão atual deste campo. Ao clicar em &ldquo;Ajustar
            enquadramento&rdquo;, você cria uma nova Mídia recortada e este campo passa a
            apontar para ela.
          </span>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button type="button" style={primaryButtonStyle} onClick={handleOpen}>
              Ajustar enquadramento
            </button>
          </div>
        </div>
      </div>

      {open && (
        <CropModal onClose={() => (submitting ? undefined : setOpen(false))}>
          <div style={{ position: 'relative', width: '100%', height: 480, background: '#000' }}>
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect ?? naturalAspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition
              objectFit="contain"
              minZoom={1}
              maxZoom={3}
            />
          </div>

          <div style={modalControlsStyle}>
            <label style={modalLabelStyle}>
              <span>Proporção</span>
              <select
                style={modalSelectStyle}
                value={aspect === null ? 'free' : String(aspect)}
                onChange={(e) => {
                  const v = e.target.value
                  setAspect(v === 'free' ? null : Number(v))
                }}
                disabled={submitting}
              >
                {ASPECT_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value === null ? 'free' : String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={modalLabelStyle}>
              <span>Zoom: {zoom.toFixed(2)}x</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                disabled={submitting}
              />
            </label>

            {errorMessage && (
              <div style={errorBoxStyle}>{errorMessage}</div>
            )}

            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="button"
                style={primaryButtonStyle}
                onClick={handleConfirm}
                disabled={submitting || !croppedAreaPixels}
              >
                {submitting ? 'Gerando imagem...' : 'Aplicar recorte'}
              </button>
            </div>
          </div>
        </CropModal>
      )}
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '10px 12px',
        fontSize: 13,
        color: 'var(--theme-elevation-700, #888)',
        background: 'var(--theme-elevation-50, rgba(255,255,255,0.04))',
        border: '1px dashed var(--theme-border-color, #333)',
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  )
}

function CropModal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div role="dialog" aria-modal style={modalBackdropStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <strong>Ajustar enquadramento</strong>
          <button type="button" aria-label="Fechar" style={iconButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  marginTop: 8,
  marginBottom: 8,
}

const previewWrapStyle: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'flex-start',
  padding: 10,
  borderRadius: 6,
  background: 'var(--theme-elevation-50, rgba(255,255,255,0.03))',
  border: '1px solid var(--theme-border-color, #333)',
}

const previewBoxStyle: React.CSSProperties = {
  position: 'relative',
  flexShrink: 0,
  width: 240,
  height: 160,
  borderRadius: 4,
  overflow: 'hidden',
  background: '#0a0a0a',
}

const previewMetaStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: 0,
}

const primaryButtonStyle: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  background: 'var(--theme-success-500, #2f9e44)',
  color: '#fff',
  border: '1px solid var(--theme-success-500, #2f9e44)',
  cursor: 'pointer',
}

const secondaryButtonStyle: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: 4,
  fontSize: 13,
  background: 'transparent',
  color: 'var(--theme-text, #fff)',
  border: '1px solid var(--theme-border-color, #555)',
  cursor: 'pointer',
}

const errorBoxStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 4,
  fontSize: 12,
  color: '#ff6b6b',
  background: 'rgba(255, 107, 107, 0.08)',
  border: '1px solid rgba(255, 107, 107, 0.35)',
  flexBasis: '100%',
}

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
}

const modalContentStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 920,
  background: 'var(--theme-bg, #1a1a1a)',
  border: '1px solid var(--theme-border-color, #333)',
  borderRadius: 8,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--theme-border-color, #333)',
  fontSize: 15,
}

const modalControlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  alignItems: 'center',
  flexWrap: 'wrap',
  padding: 14,
  borderTop: '1px solid var(--theme-border-color, #333)',
}

const modalLabelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 12,
}

const modalSelectStyle: React.CSSProperties = {
  padding: '6px 10px',
  background: 'var(--theme-elevation-50, #222)',
  color: 'var(--theme-text, #fff)',
  border: '1px solid var(--theme-border-color, #444)',
  borderRadius: 4,
  fontSize: 13,
}

const iconButtonStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid var(--theme-border-color, #555)',
  color: 'var(--theme-text, #fff)',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
}
