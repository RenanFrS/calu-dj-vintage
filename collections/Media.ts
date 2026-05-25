import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mídia',
    plural: 'Mídias',
  },
  admin: {
    group: 'Administração',
    description: 'Repositório de imagens e vídeos enviados para o Cloudinary.',
    components: {
      beforeListTable: ['/components/admin/MediaDirectUpload#default'],
    },
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*', 'video/*'],
    crop: false,
    focalPoint: false,
    adminThumbnail: ({ doc }) => {
      const record = doc as Record<string, unknown>
      return (record.cloudinarySecureUrl as string) || (record.url as string) || null
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      required: true,
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      label: 'Cloudinary public_id',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'cloudinaryResourceType',
      type: 'text',
      label: 'Tipo de recurso',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'cloudinaryFormat',
      type: 'text',
      label: 'Formato',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'cloudinarySecureUrl',
      type: 'text',
      admin: { readOnly: true, hidden: true },
    },
  ],
}
