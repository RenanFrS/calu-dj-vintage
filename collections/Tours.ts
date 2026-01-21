import type { CollectionConfig } from 'payload'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'venue',
    defaultColumns: ['venue', 'date', 'location', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      label: 'Data do Show',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Local/Evento',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      label: 'Cidade/Estado',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'available',
      options: [
        { label: 'Ingressos Disponíveis', value: 'available' },
        { label: 'Últimos Ingressos', value: 'few-tickets' },
        { label: 'Esgotado', value: 'sold-out' },
      ],
      required: true,
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Link para Ingressos',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destaque',
      defaultValue: false,
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
  ],
}
