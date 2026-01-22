import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { pt } from 'payload/i18n/pt'

// Importações do Storage (S3/R2)
import { s3Storage } from '@payloadcms/storage-s3'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tours } from './collections/Tours'
import { Sets } from './collections/Sets'
import { GalleryImages } from './collections/GalleryImages'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { About } from './globals/About'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Calu DJ',
      // openGraph: { ... }
    },
  },

  collections: [Users, Media, Tours, Sets, GalleryImages],
  globals: [SiteSettings, About],

  // Safe defaults to prevent runtime errors in Payload init
  blocks: [],
  hooks: {},

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret', // Agora ele vai ler do seu .env

  db: mongooseAdapter({
    // Lê a URL do seu .env
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/caludj',
  }),

  // --- CONFIGURAÇÃO DO CLOUDFLARE R2 (STORAGE) ---
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
        // Habilita o R2 para a coleção 'media'
        // Certifique-se de que o slug da sua collection Media é 'media'
        media: true,
        // Se 'gallery-images' também tiver upload, adicione aqui:
        // 'gallery-images': true,
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