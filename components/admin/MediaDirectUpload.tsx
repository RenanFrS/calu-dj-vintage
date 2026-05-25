'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SignResponse {
  timestamp: number
  signature: string
  apiKey: string
  cloudName: string
  folder: string
  resourceType: 'image' | 'video' | 'auto'
}

interface CloudinaryUploadResponse {
  public_id: string
  secure_url: string
  format: string
  resource_type: 'image' | 'video' | 'raw'
  bytes: number
  width?: number
  height?: number
  original_filename: string
}

const MAX_LIMIT_NOTE = 'O upload padrão da Vercel é limitado a ~4.5MB. Use esta opção para arquivos maiores.'

export default function MediaDirectUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const reset = useCallback(() => {
    setStatus(null)
    setError(null)
    setProgress(0)
    setBusy(false)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const uploadToCloudinary = (
    file: File,
    sign: SignResponse,
  ): Promise<CloudinaryUploadResponse> =>
    new Promise((resolve, reject) => {
      const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`
      const form = new FormData()
      form.append('file', file)
      form.append('api_key', sign.apiKey)
      form.append('timestamp', String(sign.timestamp))
      form.append('signature', sign.signature)
      form.append('folder', sign.folder)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', endpoint)
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          setProgress(Math.round((evt.loaded / evt.total) * 100))
        }
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText))
          } catch (e) {
            reject(new Error('Resposta inválida do Cloudinary'))
          }
        } else {
          reject(new Error(`Cloudinary HTTP ${xhr.status}: ${xhr.responseText.slice(0, 200)}`))
        }
      }
      xhr.onerror = () => reject(new Error('Falha de rede no upload para Cloudinary'))
      xhr.send(form)
    })

  const handleFile = async (file: File) => {
    setBusy(true)
    setError(null)
    setProgress(0)

    try {
      setStatus('Solicitando assinatura...')
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: file.type.startsWith('video/') ? 'video' : 'image',
        }),
      })
      if (!signRes.ok) {
        throw new Error(`Falha ao assinar upload (HTTP ${signRes.status})`)
      }
      const sign = (await signRes.json()) as SignResponse

      setStatus(`Enviando ${file.name} para Cloudinary...`)
      const result = await uploadToCloudinary(file, sign)

      setStatus('Registrando mídia no Payload...')
      const createRes = await fetch('/api/media-direct', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt: file.name.replace(/\.[^.]+$/, ''),
          filename: `${result.original_filename}.${result.format}`,
          mimeType: file.type,
          filesize: result.bytes,
          width: result.width,
          height: result.height,
          cloudinaryPublicId: result.public_id,
          cloudinarySecureUrl: result.secure_url,
          cloudinaryFormat: result.format,
          cloudinaryResourceType: result.resource_type,
        }),
      })
      if (!createRes.ok) {
        const text = await createRes.text().catch(() => '')
        throw new Error(`Falha ao criar Media no Payload: ${text || createRes.status}`)
      }

      setStatus('Upload concluído!')
      setProgress(100)
      router.refresh()
      setTimeout(reset, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setBusy(false)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
  }

  return (
    <div style={wrapStyle}>
      <div style={headerStyle}>
        <div>
          <strong style={{ display: 'block', marginBottom: 2 }}>Upload direto (arquivos grandes)</strong>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{MAX_LIMIT_NOTE}</span>
        </div>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? 'Enviando...' : 'Selecionar arquivo'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={onChange}
        />
      </div>

      {(status || error || busy) && (
        <div style={statusStyle}>
          {status && <div style={{ fontSize: 13 }}>{status}</div>}
          {busy && (
            <div style={progressTrackStyle}>
              <div style={{ ...progressBarStyle, width: `${progress}%` }} />
            </div>
          )}
          {error && <div style={errorStyle}>{error}</div>}
        </div>
      )}
    </div>
  )
}

const wrapStyle: React.CSSProperties = {
  margin: '0 0 18px',
  padding: 14,
  borderRadius: 6,
  border: '1px dashed var(--theme-border-color, #444)',
  background: 'var(--theme-elevation-50, rgba(255,255,255,0.03))',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
  flexWrap: 'wrap',
}

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  background: 'var(--theme-success-500, #2f9e44)',
  color: '#fff',
  border: '1px solid var(--theme-success-500, #2f9e44)',
  cursor: 'pointer',
}

const statusStyle: React.CSSProperties = {
  marginTop: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const progressTrackStyle: React.CSSProperties = {
  width: '100%',
  height: 6,
  borderRadius: 3,
  background: 'var(--theme-elevation-100, rgba(255,255,255,0.08))',
  overflow: 'hidden',
}

const progressBarStyle: React.CSSProperties = {
  height: '100%',
  background: 'var(--theme-success-500, #2f9e44)',
  transition: 'width 0.2s ease',
}

const errorStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 4,
  fontSize: 12,
  color: '#ff6b6b',
  background: 'rgba(255, 107, 107, 0.08)',
  border: '1px solid rgba(255, 107, 107, 0.35)',
}
