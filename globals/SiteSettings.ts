import type { GlobalConfig } from 'payload'
import { revalidateHomeAfterChange } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações do Site',
  admin: {
    group: 'Configurações',
    description: 'Identidade visual, backgrounds, redes sociais, textos e SEO.',
  },
  hooks: {
    afterChange: [revalidateHomeAfterChange],
  },
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
          description: 'Configure o background do hero com suporte a imagem, GIF ou vídeo',
          fields: [
            {
              name: 'heroBackgroundDesktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Desktop',
              admin: {
                description: 'Aceita: Imagem (JPG, PNG, WebP), GIF animado ou Vídeo (MP4, WebM). Resolução recomendada: 1920x1080',
              },
            },
            {
              name: 'heroBackgroundMobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Mobile',
              admin: {
                description: 'Aceita: Imagem (JPG, PNG, WebP), GIF animado ou Vídeo (MP4, WebM). Resolução recomendada: 1080x1920. Se vazio, usa o desktop.',
              },
            },
            {
              name: 'heroOverlayOpacity',
              type: 'number',
              label: 'Opacidade do overlay escuro (%)',
              defaultValue: 40,
              min: 0,
              max: 100,
              admin: {
                description: 'Controla o escurecimento sobre o background (0 = sem overlay, 100 = totalmente escuro)',
              },
            },
          ],
        },
        {
          label: 'Background Seções',
          description: 'Configure o background para todas as seções abaixo do hero',
          fields: [
            {
              name: 'sectionsBackgroundDesktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Seções - Desktop',
              admin: {
                description: 'Aceita: Imagem (JPG, PNG, WebP), GIF animado ou Vídeo (MP4, WebM). Este background será usado em todas as seções abaixo do hero.',
              },
            },
            {
              name: 'sectionsBackgroundMobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Seções - Mobile',
              admin: {
                description: 'Se vazio, usa o desktop',
              },
            },
            {
              name: 'sectionsOverlayOpacity',
              type: 'number',
              label: 'Opacidade do overlay escuro (%)',
              defaultValue: 60,
              min: 0,
              max: 100,
              admin: {
                description: 'Controla o escurecimento sobre o background das seções',
              },
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
