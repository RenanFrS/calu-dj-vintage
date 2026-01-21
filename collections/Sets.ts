import type { CollectionConfig } from 'payload'

export const Sets: CollectionConfig = {
  slug: 'sets',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featuring', 'platform', 'order'],
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
      name: 'featuring',
      type: 'text',
      label: 'Descrição/Featuring',
    },
    {
      name: 'platform',
      type: 'select',
      label: 'Plataforma',
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'SoundCloud', value: 'soundcloud' },
        { label: 'Spotify', value: 'spotify' },
        { label: 'Mixcloud', value: 'mixcloud' },
      ],
      required: true,
    },
    {
      name: 'videoId',
      type: 'text',
      label: 'ID do Vídeo (YouTube)',
      admin: {
        description: 'Apenas o ID do vídeo, ex: 0ieVBg5Nfj8',
        condition: (data) => data.platform === 'youtube',
      },
    },
    {
      name: 'embedUrl',
      type: 'text',
      label: 'URL do Embed',
      admin: {
        description: 'URL completa para embed (SoundCloud, Mixcloud, etc)',
        condition: (data) => data.platform !== 'youtube',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail personalizada',
      admin: {
        description: 'Deixe vazio para usar a thumbnail do YouTube automaticamente',
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
