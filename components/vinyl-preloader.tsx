"use client"

import { useEffect, useState } from "react"

export function VinylPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const finished = progress >= 100

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${finished ? 'opacity-0 pointer-events-none -z-10' : 'opacity-100'}`}>
      {/* Vinyl record */}
      <div className="relative z-10 mb-8">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Spinning vinyl */}
          <div className="absolute inset-0 animate-spin-slow">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
              <circle cx="100" cy="100" r="95" fill="#000000" stroke="#222222" strokeWidth="2" />

              {/* Grooves - sulcos do vinil */}
              {[85, 75, 65, 55, 45, 35].map((r, i) => (
                <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              ))}

              <circle cx="100" cy="100" r="28" fill="#96AF82" />

              {/* Texto circular no label - cada letra posicionada ao redor do centro */}
              {Array.from("★ DJ CALU ★ DJ CALU ").map((char, i, arr) => {
                const angle = (360 / arr.length) * i - 90;
                const radius = 22;
                const x = 100 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 100 + radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill="#ffffff"
                    fontSize="6"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${angle + 90}, ${x}, ${y})`}
                  >
                    {char}
                  </text>
                );
              })}

              {/* Center hole */}
              <circle cx="100" cy="100" r="4" fill="#000000" />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-5xl md:text-6xl font-bold text-white font-serif">{progress}%</p>
        <p className="text-sm text-gray-400 tracking-[0.3em] uppercase font-mono">{"Carregando"}</p>
      </div>
    </div>
  )
}
