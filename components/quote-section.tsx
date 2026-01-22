'use client'

import { Instagram, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuoteSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif mb-4">
              Peça um Orçamento
            </h2>
            <div className="w-24 h-1 bg-white mx-auto" />
          </div>

          {/* Card with glassmorphism effect */}
          <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
            
            {/* Main card */}
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl">
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/30 rounded-br-2xl" />
              
              <div className="space-y-8 text-center">
                {/* Description */}
                <p className="text-center text-lg md:text-xl text-white/90 leading-relaxed">
                  Interessado em ter DJ Calu no seu evento?<br />
                  Entre em contato para solicitar um orçamento personalizado.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Instagram DM Button */}
                  <a 
                    href="https://ig.me/m/caluzete" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group/btn"
                  >
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/btn:scale-105"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      Mande uma mensagem
                    </Button>
                  </a>

                  {/* WhatsApp Button (optional - you can customize or remove) */}
                  <a 
                    href="mailto:djcaludj@gmail.com" 
                    className="group/btn"
                  >
                   {/*  <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/btn:scale-105 backdrop-blur-sm"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Enviar e-mail
                    </Button> */}
                  </a>
                </div>

                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="px-4 text-white/60 text-sm">ou</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* Email */}
                <div className="text-center space-y-2">
                  <p className="text-white/70 text-sm uppercase tracking-wider">Email direto</p>
                  <a 
                    href="mailto:djcaludj@gmail.com"
                    className="inline-flex items-center gap-2 text-xl md:text-2xl font-medium text-white hover:text-white/80 transition-colors duration-300 group/email"
                  >
                    <Mail className="w-6 h-6 group-hover/email:scale-110 transition-transform" />
                    djcaludj@gmail.com
                  </a>
                </div>

                {/* Bottom decorative element */}
                <div className="flex justify-center pt-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-200" />
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
