import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface DirectUploadBody {
  alt: string
  filename: string
  mimeType: string
  filesize?: number
  width?: number
  height?: number
  cloudinaryPublicId: string
  cloudinarySecureUrl: string
  cloudinaryFormat?: string
  cloudinaryResourceType?: 'image' | 'video' | 'raw'
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as DirectUploadBody | null
  if (!body || !body.cloudinarySecureUrl || !body.cloudinaryPublicId || !body.filename) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  try {
    const doc = await payload.create({
      collection: 'media',
      data: {
        alt: body.alt || body.filename,
        filename: body.filename,
        mimeType: body.mimeType,
        filesize: body.filesize,
        width: body.width,
        height: body.height,
        url: body.cloudinarySecureUrl,
        cloudinarySecureUrl: body.cloudinarySecureUrl,
        cloudinaryPublicId: body.cloudinaryPublicId,
        cloudinaryFormat: body.cloudinaryFormat,
        cloudinaryResourceType: body.cloudinaryResourceType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      user,
      overrideAccess: false,
    })
    return NextResponse.json({ doc })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
