import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Administração',
    description: 'Acesso ao painel administrativo.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
    },
  ],
}
