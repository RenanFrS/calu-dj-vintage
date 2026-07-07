import { Instagram, Youtube, Music2, Mail, Heart } from "lucide-react"
import { FaInstagram, FaYoutube, FaSoundcloud, FaSpotify, FaTiktok, FaTwitter, FaFacebook } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import type { SiteSettings, SocialLink } from "@/types/payload"

interface FooterProps {
  siteSettings?: SiteSettings | null
}

// Mapeamento de ícones por plataforma
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  soundcloud: FaSoundcloud,
  spotify: FaSpotify,
  tiktok: FaTiktok,
  twitter: FaTwitter,
  facebook: FaFacebook,
  email: Mail,
}

export function Footer({ siteSettings }: FooterProps) {
  const socialLinks = siteSettings?.socialLinks?.filter(link => link.enabled !== false) || []
  const tagline = siteSettings?.footerTagline || ''
  const copyright = siteSettings?.copyrightText || ''

  return (
    <footer className="w-full border-t-4 border-secondary bg-card/50 backdrop-blur-sm">
      
      {/* Conteúdo principal */}
      <div className="mx-auto max-w-screen-xl px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-secondary font-serif">
              Calu DJ
            </h3>
            <p className="text-muted-foreground leading-relaxed flex items-center gap-2">
              <span className="leading-tight">{tagline}</span>
              <Heart className="flex-shrink-0 w-5 h-5" aria-hidden="true" />
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#music" className="text-muted-foreground hover:text-primary transition-colors">
                  Música
                </a>
              </li>
              <li>
                <a href="#tour" className="text-muted-foreground hover:text-primary transition-colors">
                  Tour
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Redes Sociais</h4>
            <div className="flex gap-3">
              {socialLinks.slice(0, 4).map((link, index) => {
                const IconComponent = socialIcons[link.platform]
                if (!IconComponent) return null
                return (
                  <Button
                    key={link.id || index}
                    size="icon"
                    variant="outline"
                    className="rounded-full border-2 border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    asChild
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                      <IconComponent className="h-5 w-5" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Divider full width */}
      <div className="w-full border-t-2 border-secondary/30" />

      {/* Bottom */}
      <div className="mx-auto max-w-screen-xl px-4 py-6 text-center text-sm text-muted-foreground space-y-1">
        {copyright && <p>{copyright}</p>}
        <p>
          Desenvolvido por{" "}
          <a
            href="https://www.instagram.com/renanrocha.01/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-secondary underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            Renan Rocha
          </a>
        </p>
      </div>

    </footer>
  )
}
