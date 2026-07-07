import type { CollectionConfig } from 'payload'
import { revalidateHomeAfterChange } from '../lib/revalidate'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Avaliação',
    plural: 'Avaliações',
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'date', 'order'],
    group: 'Conteúdo',
    description: 'Avaliações reais exibidas na seção "Avaliações no Google" da home.',
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
      name: 'authorName',
      type: 'text',
      label: 'Nome de quem avaliou',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto da pessoa',
      admin: {
        description: 'Opcional. Se vazio, mostramos a inicial do nome em um círculo colorido (como no Google).',
      },
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Nota (estrelas)',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      admin: {
        description: 'De 1 a 5 estrelas.',
        step: 1,
      },
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Avaliação',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Data da avaliação',
      admin: {
        description: 'Opcional. Usada para exibir "há 2 semanas", etc.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
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
