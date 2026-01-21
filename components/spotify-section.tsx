'use client'

import Image from 'next/image'

export function SpotifySection() {
  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left side - Text and Spotify logo */}
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-serif drop-shadow-2xl">
              THIS IS<br />CALU
            </h2>
        
          </div>

          {/* Right side - Spotify Embed */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
             <iframe data-testid="embed-iframe" style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/artist/1kqlYPWo8aVtw8a7yovJgz?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}