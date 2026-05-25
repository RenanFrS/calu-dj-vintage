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

import { SiteSettings } from './globals/SiteSettings'
import { About } from './globals/About'
import { en } from '@payloadcms/translations/languages/en'
import { pt } from '@payloadcms/translations/languages/pt'

import { cloudinaryAdapter } from './lib/cloudinary/adapter'
import { isCloudinaryConfigured } from './lib/cloudinary/client'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,

  i18n: {
    fallbackLanguage: 'pt',
    supportedLanguages: { pt, en },
  },

  secret: process.env.PAYLOAD_SECRET || '',

  cors: [serverURL].filter(Boolean),
  csrf: [serverURL].filter(Boolean),

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

  collections: [Users, Media, Tours, Sets, GalleryImages],
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
