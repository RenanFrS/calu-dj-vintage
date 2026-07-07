import type { CollectionConfig } from 'payload'
import { revalidateHomeAfterChange } from '../lib/revalidate'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: {
    singular: 'Galeria',
    plural: 'Galeria',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'image', 'order'],
    group: 'Conteúdo',
    description: 'Imagens exibidas na galeria da home.',
  },
  hooks: {
    afterChange: [revalidateHomeAfterChange],
    afterDelete: [revalidateHomeAfterChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem',
      required: true,
    },
    {
      name: 'imageCrop',
      type: 'json',
      label: 'Enquadramento',
      admin: {
        components: {
          Field: {
            path: '/components/admin/ImageCropField#default',
            clientProps: { uploadFieldName: 'image', defaultAspect: null },
          },
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordem de exibição',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destaque',
      defaultValue: false,
    },
  ],
}
