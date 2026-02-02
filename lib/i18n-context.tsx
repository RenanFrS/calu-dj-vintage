"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Language = "pt" | "en" | "fr"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navigation
    "nav.music": "Música",
    "nav.schedule": "Agenda",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    // Hero
    "hero.listening": "Você está ouvindo",
    // Tour Section
    "tour.title": "Próximos Shows",
    "tour.buyTickets": "Comprar Ingressos",
    "tour.noShows": "Configure no seu painel de admin!",
    // About
    "about.title": "Sobre",
    "about.configure": "Configure no seu painel de admin!",
    // Music
    "music.title": "Últimas Tracks",
    "music.listen": "Ouvir",
    "music.configure": "Configure no seu painel de admin!",
    // Gallery
    "gallery.title": "Galeria",
    "gallery.configure": "Configure no seu painel de admin!",
    // Newsletter
    "newsletter.title": "Newsletter",
    "newsletter.subtitle": "Fique por dentro das novidades",
    "newsletter.placeholder": "Seu e-mail",
    "newsletter.button": "Inscrever",
    // Footer
    "footer.rights": "Todos os direitos reservados",
    // General
    "configure.admin": "Configure no seu painel de admin!",
  },
  en: {
    // Navigation
    "nav.music": "Music",
    "nav.schedule": "Schedule",
    "nav.about": "About",
    "nav.contact": "Contact",
    // Hero
    "hero.listening": "You are listening to",
    // Tour Section
    "tour.title": "Upcoming Shows",
    "tour.buyTickets": "Buy Tickets",
    "tour.noShows": "Configure in your admin panel!",
    // About
    "about.title": "About",
    "about.configure": "Configure in your admin panel!",
    // Music
    "music.title": "Latest Tracks",
    "music.listen": "Listen",
    "music.configure": "Configure in your admin panel!",
    // Gallery
    "gallery.title": "Gallery",
    "gallery.configure": "Configure in your admin panel!",
    // Newsletter
    "newsletter.title": "Newsletter",
    "newsletter.subtitle": "Stay updated with the latest news",
    "newsletter.placeholder": "Your email",
    "newsletter.button": "Subscribe",
    // Footer
    "footer.rights": "All rights reserved",
    // General
    "configure.admin": "Configure in your admin panel!",
  },
  fr: {
    // Navigation
    "nav.music": "Musique",
    "nav.schedule": "Agenda",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    // Hero
    "hero.listening": "Vous écoutez",
    // Tour Section
    "tour.title": "Prochains Concerts",
    "tour.buyTickets": "Acheter des Billets",
    "tour.noShows": "Configurez dans votre panneau d'administration!",
    // About
    "about.title": "À propos",
    "about.configure": "Configurez dans votre panneau d'administration!",
    // Music
    "music.title": "Dernières Pistes",
    "music.listen": "Écouter",
    "music.configure": "Configurez dans votre panneau d'administration!",
    // Gallery
    "gallery.title": "Galerie",
    "gallery.configure": "Configurez dans votre panneau d'administration!",
    // Newsletter
    "newsletter.title": "Newsletter",
    "newsletter.subtitle": "Restez informé des dernières nouvelles",
    "newsletter.placeholder": "Votre e-mail",
    "newsletter.button": "S'inscrire",
    // Footer
    "footer.rights": "Tous droits réservés",
    // General
    "configure.admin": "Configurez dans votre panneau d'administration!",
  },
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null
    if (saved && ["pt", "en", "fr"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
