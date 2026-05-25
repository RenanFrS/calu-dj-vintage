import type { GlobalConfig } from 'payload'
import { revalidateHomeAfterChange } from '../lib/revalidate'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'Seção Quem Sou',
  admin: {
    group: 'Configurações',
    description: 'Conteúdo da seção "Quem Sou" em PT/EN/FR.',
  },
  hooks: {
    afterChange: [revalidateHomeAfterChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto de Perfil',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Português',
          fields: [
            {
              name: 'title_pt',
              type: 'text',
              label: 'Título',
              defaultValue: 'DJ Calu',
              required: true,
            },
            {
              name: 'subtitle_pt',
              type: 'textarea',
              label: 'Subtítulo/Descrição Curta',
              defaultValue: 'é uma artista franco-brasileira nascida em Minas Gerais, cuja identidade musical se constrói a partir de uma forte herança multicultural, com origens francesa, tunisiana e indígena.',
            },
            {
              name: 'paragraphs_pt',
              type: 'array',
              label: 'Parágrafos de Conteúdo',
              fields: [
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Texto',
                  required: true,
                },
              ],
              defaultValue: [
                {
                  content: 'Inserida no universo da música desde a infância — filha de mãe cantora e pai baterista — iniciou seus estudos musicais aos 8 anos no piano. É formada em Piano Popular pela Universidade Estadual de Campinas (UNICAMP), onde desenvolveu não apenas técnica e repertório, mas também uma escuta sensível e ampla. Foi nesse ambiente que despertou seu interesse pela discotecagem, passando a pesquisar e aprofundar sua atuação como DJ.',
                },
                {
                  content: 'Com uma presença de palco envolvente e sets dinâmicos, DJ Calu constrói pistas diversas e vibrantes. Seu repertório mistura brasilidades, funk, reggaeton e pop nacional e internacional, equilibrando hits populares com descobertas sonoras que dialogam com diferentes públicos, sempre com leveza, energia e conexão.',
                },
                {
                  content: 'Além dos palcos, DJ Calu vem consolidando uma comunidade crescente em seu canal no YouTube, espaço dedicado à valorização da música brasileira em todas as suas facetas. Seu trabalho se move pelo desejo de tornar a pista um ambiente inclusivo, acessível, onde a diversidade cultural é celebrada através do som.',
                },
              ],
            },
            {
              name: 'tagline_pt',
              type: 'text',
              label: 'Frase de destaque',
              defaultValue: 'A pista como espaço de inclusão',
            },
          ],
        },
        {
          label: 'English',
          fields: [
            {
              name: 'title_en',
              type: 'text',
              label: 'Title',
              defaultValue: 'DJ Calu',
            },
            {
              name: 'subtitle_en',
              type: 'textarea',
              label: 'Subtitle/Short Description',
              defaultValue: 'is a Franco-Brazilian artist born in Minas Gerais, whose musical identity is built from a strong multicultural heritage, with French, Tunisian and indigenous origins.',
            },
            {
              name: 'paragraphs_en',
              type: 'array',
              label: 'Content Paragraphs',
              fields: [
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Text',
                  required: true,
                },
              ],
            },
            {
              name: 'tagline_en',
              type: 'text',
              label: 'Tagline',
              defaultValue: 'The dance floor as a space of inclusion',
            },
          ],
        },
        {
          label: 'Français',
          fields: [
            {
              name: 'title_fr',
              type: 'text',
              label: 'Titre',
              defaultValue: 'DJ Calu',
            },
            {
              name: 'subtitle_fr',
              type: 'textarea',
              label: 'Sous-titre/Description courte',
              defaultValue: 'est une artiste franco-brésilienne née au Minas Gerais, dont l\'identité musicale se construit à partir d\'un fort héritage multiculturel, avec des origines françaises, tunisiennes et indigènes.',
            },
            {
              name: 'paragraphs_fr',
              type: 'array',
              label: 'Paragraphes de contenu',
              fields: [
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Texte',
                  required: true,
                },
              ],
            },
            {
              name: 'tagline_fr',
              type: 'text',
              label: 'Phrase d\'accroche',
              defaultValue: 'La piste comme espace d\'inclusion',
            },
          ],
        },
      ],
    },
  ],
}
