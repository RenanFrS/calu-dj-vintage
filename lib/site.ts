// Identidade e SEO do site — fonte única de verdade para metadados.

/**
 * URL canônica de produção. Fixa por padrão (a URL oficial do site),
 * mas pode ser sobrescrita por ambiente via NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://djcalu.bocaboca.com.br'
).replace(/\/+$/, '')

export const SITE_NAME = 'DJ Calu'

export const DEFAULT_TITLE = 'DJ Calu — DJ e artista musical franco-brasileira'

export const DEFAULT_DESCRIPTION =
  'Site oficial da DJ Calu — DJ e artista musical franco-brasileira. Conheça a música, os sets, a agenda de shows e a galeria da Calu: brasilidades, funk, pop e muito mais para deixar a pista vibrante.'

/** Imagem padrão de compartilhamento (Open Graph / Twitter). 1200x630. */
export const DEFAULT_OG_IMAGE = '/og-default.png'

/** Link direto para escrever uma avaliação no Google (botão "Avaliar"). */
export const GOOGLE_REVIEW_URL = 'https://g.page/r/Cf0IDWuAdHM7EAE/review'

/** Link para o perfil/local no Google (ver todas as avaliações). */
export const GOOGLE_PLACE_URL = 'https://share.google/jkeBo7CnntGsEJdrM'

export const SITE_KEYWORDS = [
  'DJ',
  'Música',
  'Calu',
  'DJ Calu',
  'Calu DJ',
  'DJ Calu música',
  'DJ franco-brasileira',
  'DJ para eventos',
  'DJ para festas e casamentos',
  'set de DJ',
  'discotecagem',
  'música vintage',
  'música brasileira',
  'DJ brasileira',
  'DJ Minas Gerais',
]
