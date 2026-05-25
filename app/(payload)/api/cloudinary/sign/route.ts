import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  CLOUDINARY_FOLDER,
  getCloudName,
  getCloudinary,
  isCloudinaryConfigured,
} from '@/lib/cloudinary/client'

export async function POST(req: NextRequest) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'cloudinary_not_configured' }, { status: 500 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as {
    resourceType?: 'image' | 'video' | 'auto'
    publicId?: string
  }

  const resourceType = body.resourceType || 'auto'
  const folder = `${CLOUDINARY_FOLDER}/media`
  const timestamp = Math.floor(Date.now() / 1000)

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  }
  if (body.publicId) paramsToSign.public_id = body.publicId

  const cloudinary = getCloudinary()
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET || '',
  )

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: getCloudName(),
    folder,
    resourceType,
  })
}
