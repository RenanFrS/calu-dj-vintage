import type { CollectionConfig } from 'payload'
import { s3Adapter } from '../lib/s3Adapter'
import { r2Adapter } from '../lib/r2Adapter'

// Escolhe o adaptador pela prioridade: R2 -> S3
const storageAdapter = process.env.R2_BUCKET
  ? r2Adapter({ bucket: process.env.R2_BUCKET!, accountId: process.env.R2_ACCOUNT_ID, endpoint: process.env.R2_ENDPOINT, folder: process.env.S3_FOLDER || 'media' })
  : process.env.S3_BUCKET
  ? s3Adapter({ bucket: process.env.S3_BUCKET!, region: process.env.S3_REGION!, folder: process.env.S3_FOLDER || 'media' })
  : undefined

// uploadConfig usa adapter (R2/S3) se disponível; caso contrário usa staticDir para desenvolvimento local
const uploadConfig: any = storageAdapter
  ? {
      adapter: storageAdapter,
      mimeTypes: ['image/*', 'video/*'],
      imageSizes: [
        {
          name: 'thumbnail',
          width: 400,
          height: 300,
          position: 'centre',
        },
        {
          name: 'card',
          width: 768,
          height: 1024,
          position: 'centre',
        },
        {
          name: 'hero',
          width: 1920,
          height: 1080,
          position: 'centre',
        },
      ],
      adminThumbnail: 'thumbnail',
    }
  : {
      staticDir: 'media',
      mimeTypes: ['image/*', 'video/*'],
      imageSizes: [
        {
          name: 'thumbnail',
          width: 400,
          height: 300,
          position: 'centre',
        },
        {
          name: 'card',
          width: 768,
          height: 1024,
          position: 'centre',
        },
        {
          name: 'hero',
          width: 1920,
          height: 1080,
          position: 'centre',
        },
      ],
      adminThumbnail: 'thumbnail',
    }

if (!storageAdapter) {
  // Aviso claro ao iniciar o servidor em desenvolvimento local
  // (evite commitar essa mensagem em produção)
  console.warn('Using local static storage for Media; set R2_BUCKET or S3_BUCKET to enable remote storage (R2 recommended).')
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: uploadConfig,
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      required: true,
    },
  ],
}
