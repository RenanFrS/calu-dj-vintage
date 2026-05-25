import type {
  Adapter,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { UploadApiOptions } from 'cloudinary'

import { CLOUDINARY_FOLDER, getCloudinary, resourceTypeFromMime, stripExt } from './client'

interface CloudinaryAdapterArgs {
  folder?: string
}

export const cloudinaryAdapter = ({ folder }: CloudinaryAdapterArgs = {}): Adapter => {
  const baseFolder = folder || CLOUDINARY_FOLDER

  return ({ collection, prefix }): GeneratedAdapter => {
    const collectionFolder = [baseFolder, prefix, collection.slug]
      .filter(Boolean)
      .join('/')

    return {
      name: 'cloudinary',

      handleUpload: async ({ file, data }) => {
        const cloudinary = getCloudinary()
        const resourceType = resourceTypeFromMime(file.mimeType)
        const publicId = stripExt(file.filename)

        const uploadOptions: UploadApiOptions = {
          folder: collectionFolder,
          public_id: publicId,
          resource_type: resourceType,
          overwrite: true,
          use_filename: false,
          unique_filename: false,
        }

        const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, res) => {
            if (err || !res) return reject(err || new Error('Upload Cloudinary falhou'))
            resolve(res as unknown as Record<string, unknown>)
          })
          stream.end(file.buffer)
        })

        data.cloudinaryPublicId = result.public_id as string
        data.cloudinaryResourceType = result.resource_type as string
        data.cloudinaryFormat = result.format as string | undefined
        data.cloudinarySecureUrl = result.secure_url as string
        data.url = result.secure_url as string

        return data
      },

      handleDelete: async ({ doc }) => {
        const cloudinary = getCloudinary()
        const docRecord = doc as unknown as Record<string, unknown>
        const publicId = (docRecord.cloudinaryPublicId as string | undefined) ||
          [collectionFolder, stripExt(doc.filename || '')].filter(Boolean).join('/')
        const resourceType = (docRecord.cloudinaryResourceType as 'image' | 'video' | 'raw' | undefined) ||
          resourceTypeFromMime(doc.mimeType || undefined)

        if (!publicId) return

        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true })
        } catch (err) {
          console.warn('[cloudinary] falha ao remover', publicId, err)
        }
      },

      generateURL: ({ data }) => {
        const record = data as Record<string, unknown>
        return (record.cloudinarySecureUrl as string) || (record.url as string) || ''
      },

      staticHandler: async (_req, { doc }) => {
        const record = (doc || {}) as Record<string, unknown>
        const url = (record.cloudinarySecureUrl as string) || (record.url as string)
        if (!url) return new Response('Not Found', { status: 404 })
        return Response.redirect(url, 302)
      },
    }
  }
}
