import type { SiteSettings } from '@/types/payload'
import { getMediaUrl } from '@/types/payload'
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from '@/lib/site'

/**
 * Dados estruturados (JSON-LD / Schema.org) para o Google entender que o site
 * é de uma artista musical (DJ) e exibir resultados ricos / painel de conhecimento.
 */
export function StructuredData({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const sameAs = (siteSettings?.socialLinks ?? [])
    .filter((link) => link.enabled !== false && link.platform !== 'email' && !!link.url)
    .map((link) => link.url)

  const image = getMediaUrl(siteSettings?.logo) || `${SITE_URL}/logo/logo-teste.png`
  const description = siteSettings?.siteDescription || DEFAULT_DESCRIPTION

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: 'pt-BR',
        description,
      },
      {
        '@type': 'MusicGroup',
        '@id': `${SITE_URL}/#artist`,
        name: 'DJ Calu',
        alternateName: ['Calu', 'Calu DJ'],
        url: SITE_URL,
        image,
        description,
        genre: ['DJ set', 'Música brasileira', 'Funk', 'Pop', 'Reggaeton'],
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
