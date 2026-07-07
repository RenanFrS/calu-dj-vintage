import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tours } from './collections/Tours'
import { Sets } from './collections/Sets'
import { GalleryImages } from './collections/GalleryImages'
import { Reviews } from './collections/Reviews'

import { SiteSettings } from './globals/SiteSettings'
import { About } from './globals/About'
import { pt } from '@payloadcms/translations/languages/pt'

import { cloudinaryAdapter } from './lib/cloudinary/adapter'
import { isCloudinaryConfigured } from './lib/cloudinary/client'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function normalizeUrl(raw: string | undefined | null): string | null {
  if (!raw) return null
  let u = raw.trim().replace(/\/+$/, '')
  if (!u) return null
  const doubleProto = u.match(/^https?:\/\/(https?:\/\/.+)$/i)
  if (doubleProto) u = doubleProto[1].replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`
  try {
    return new URL(u).origin
  } catch {
    return null
  }
}

const explicitServerURL = normalizeUrl(process.env.NEXT_PUBLIC_SERVER_URL)
const vercelProdURL = normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
const vercelURL = normalizeUrl(process.env.VERCEL_URL)
const localURL = process.env.NODE_ENV === 'production' ? null : 'http://localhost:3000'

const serverURL =
  explicitServerURL || vercelProdURL || vercelURL || localURL || 'http://localhost:3000'

const allowedOrigins = Array.from(
  new Set(
    [explicitServerURL, vercelProdURL, vercelURL, localURL, serverURL].filter(
      (u): u is string => !!u,
    ),
  ),
)

export default buildConfig({
  serverURL,

  i18n: {
    // Admin 100% em português: apenas pt-BR disponível (sem opção de trocar idioma).
    fallbackLanguage: 'pt',
    supportedLanguages: { pt },
  },

  secret: process.env.PAYLOAD_SECRET || '',

  cors: allowedOrigins,
  csrf: allowedOrigins,

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Calu DJ',
      icons: [{ url: '/logo/logo-teste.png' }],
      openGraph: {
        images: [{ url: '/logo/logo-teste.png' }],
      },
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
  },

  collections: [Users, Media, Tours, Sets, GalleryImages, Reviews],
  globals: [SiteSettings, About],

  editor: lexicalEditor(),

  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/caludj',
  }),

  plugins: [
    cloudStoragePlugin({
      enabled: isCloudinaryConfigured(),
      collections: {
        media: {
          adapter: cloudinaryAdapter(),
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,
})
