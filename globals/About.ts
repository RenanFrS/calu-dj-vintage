import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'Seção Quem Sou',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      defaultValue: 'DJ Calu',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo/Descrição Curta',
      defaultValue: 'é uma artista franco-brasileira nascida em Minas Gerais, cuja identidade musical se constrói a partir de uma forte herança multicultural, com origens francesa, tunisiana e indígena.',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto de Perfil',
      required: true,
    },
    {
      name: 'paragraphs',
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
      name: 'tagline',
      type: 'text',
      label: 'Frase de destaque',
      defaultValue: 'A pista como espaço de inclusão',
    },
  ],
}
