import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações do Site',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identidade Visual',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
            },
            {
              name: 'logoAlt',
              type: 'text',
              label: 'Texto alternativo da Logo',
              defaultValue: 'Calu DJ Logo',
            },
          ],
        },
        {
          label: 'Background Hero',
          fields: [
            {
              name: 'heroBackgroundDesktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Desktop (vídeo ou imagem)',
              admin: {
                description: 'Vídeo ou imagem para o hero em desktop (1920x1080 recomendado)',
              },
            },
            {
              name: 'heroBackgroundMobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Mobile (vídeo ou imagem)',
              admin: {
                description: 'Vídeo ou imagem para o hero em mobile (1080x1920 recomendado)',
              },
            },
            {
              name: 'useVideoBackground',
              type: 'checkbox',
              label: 'Usar vídeo como background',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Redes Sociais',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Links de Redes Sociais',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Plataforma',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Email', value: 'email' },
                  ],
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Ativo',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Textos',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Título do Hero',
              defaultValue: 'DJ Calu',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Subtítulo do Hero',
            },
            {
              name: 'footerTagline',
              type: 'text',
              label: 'Tagline do Footer',
              defaultValue: 'A pista como espaço de inclusão',
            },
            {
              name: 'copyrightText',
              type: 'text',
              label: 'Texto de Copyright',
              defaultValue: '© 2025 Calu DJ. Todos os direitos reservados.',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              label: 'Título do Site',
              defaultValue: 'DJ Calu - A pista como espaço de inclusão',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Descrição do Site',
              defaultValue: 'DJ Calu é uma artista franco-brasileira com uma identidade musical multicultural.',
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem de compartilhamento (Open Graph)',
            },
          ],
        },
      ],
    },
  ],
}
