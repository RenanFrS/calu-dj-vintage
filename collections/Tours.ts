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
      name: 'eventImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cartaz/Imagem do Evento',
      admin: {
        description: 'Imagem ou cartaz do evento. Será exibido no card do show.',
      },
    },
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
      name: 'hasTickets',
      type: 'checkbox',
      label: 'Tem venda de ingressos?',
      defaultValue: false,
      admin: {
        description: 'Marque se este evento possui venda de ingressos. Se não marcado, o botão exibirá "Mais informações".',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status dos Ingressos',
      defaultValue: 'available',
      options: [
        { label: 'Ingressos Disponíveis', value: 'available' },
        { label: 'Últimos Ingressos', value: 'few-tickets' },
        { label: 'Esgotado', value: 'sold-out' },
      ],
      admin: {
        condition: (data) => data.hasTickets === true,
      },
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Link para Ingressos/Informações',
      admin: {
        description: 'Link para compra de ingressos ou página com mais informações do evento.',
      },
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
