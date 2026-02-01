import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { pt } from '@payloadcms/translations/languages/pt'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tours } from './collections/Tours'
import { Sets } from './collections/Sets'
import { GalleryImages } from './collections/GalleryImages'

import { SiteSettings } from './globals/SiteSettings'
import { About } from './globals/About'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.SECRET_SALT || 'dev-secret',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Calu DJ',
    },
  },

  collections: [Users, Media, Tours, Sets, GalleryImages],
  globals: [SiteSettings, About],

  editor: lexicalEditor(),

  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/caludj',
  }),

  plugins: [
    s3Storage({
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      collections: {
        media: true,
      },
    }),
  ],

  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,
})
