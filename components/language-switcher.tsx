"use client"

import { useI18n, Language } from "@/lib/i18n-context"

interface FlagProps {
  selected: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}

function FlagButton({ selected, onClick, label, children }: FlagProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-1 rounded transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        selected ? "opacity-100" : "opacity-60 hover:opacity-100"
      }`}
    >
      {children}
    </button>
  )
}

// Bandeira do Brasil - estilo linha vetorial
function BrazilFlag({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Retângulo externo */}
      <rect 
        x="0.5" y="0.5" width="17" height="11" 
        stroke="white" 
        strokeWidth="1" 
        fill={filled ? "white" : "none"} 
      />
      {/* Losango */}
      <path 
        d="M9 1.5 L16.5 6 L9 10.5 L1.5 6 Z" 
        stroke={filled ? "#000" : "white"} 
        strokeWidth="1" 
        fill="none" 
      />
      {/* Círculo central */}
      <circle 
        cx="9" cy="6" r="2.5" 
        stroke={filled ? "#000" : "white"} 
        strokeWidth="1" 
        fill="none" 
      />
    </svg>
  )
}

// Bandeira dos Estados Unidos - estilo linha vetorial
function USAFlag({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Retângulo externo */}
      <rect 
        x="0.5" y="0.5" width="17" height="11" 
        stroke="white" 
        strokeWidth="1" 
        fill={filled ? "white" : "none"} 
      />
      {/* Linhas horizontais */}
      <line x1="0.5" y1="2.5" x2="17.5" y2="2.5" stroke={filled ? "#000" : "white"} strokeWidth="0.5" />
      <line x1="0.5" y1="4.5" x2="17.5" y2="4.5" stroke={filled ? "#000" : "white"} strokeWidth="0.5" />
      <line x1="0.5" y1="6.5" x2="17.5" y2="6.5" stroke={filled ? "#000" : "white"} strokeWidth="0.5" />
      <line x1="0.5" y1="8.5" x2="17.5" y2="8.5" stroke={filled ? "#000" : "white"} strokeWidth="0.5" />
      <line x1="0.5" y1="10.5" x2="17.5" y2="10.5" stroke={filled ? "#000" : "white"} strokeWidth="0.5" />
      {/* Quadrado do canto (estrelas) */}
      <rect 
        x="0.5" y="0.5" width="7" height="5" 
        stroke={filled ? "#000" : "white"} 
        strokeWidth="0.5" 
        fill="none" 
      />
      {/* Estrelinhas simplificadas */}
      <circle cx="2" cy="2" r="0.4" fill={filled ? "#000" : "white"} />
      <circle cx="4" cy="2" r="0.4" fill={filled ? "#000" : "white"} />
      <circle cx="6" cy="2" r="0.4" fill={filled ? "#000" : "white"} />
      <circle cx="3" cy="3.5" r="0.4" fill={filled ? "#000" : "white"} />
      <circle cx="5" cy="3.5" r="0.4" fill={filled ? "#000" : "white"} />
    </svg>
  )
}

// Bandeira da França - estilo linha vetorial
function FranceFlag({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Retângulo externo */}
      <rect 
        x="0.5" y="0.5" width="17" height="11" 
        stroke="white" 
        strokeWidth="1" 
        fill={filled ? "white" : "none"} 
      />
      {/* Linhas verticais divisórias */}
      <line x1="6" y1="0.5" x2="6" y2="11.5" stroke={filled ? "#000" : "white"} strokeWidth="1" />
      <line x1="12" y1="0.5" x2="12" y2="11.5" stroke={filled ? "#000" : "white"} strokeWidth="1" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  return (
    <div className="flex items-center gap-1">
      <FlagButton
        selected={language === "pt"}
        onClick={() => setLanguage("pt")}
        label="Português (Brasil)"
      >
        <BrazilFlag filled={language === "pt"} />
      </FlagButton>
      
      <FlagButton
        selected={language === "en"}
        onClick={() => setLanguage("en")}
        label="English (USA)"
      >
        <USAFlag filled={language === "en"} />
      </FlagButton>
      
      <FlagButton
        selected={language === "fr"}
        onClick={() => setLanguage("fr")}
        label="Français"
      >
        <FranceFlag filled={language === "fr"} />
      </FlagButton>
    </div>
  )
}
