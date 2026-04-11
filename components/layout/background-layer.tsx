'use client'

import { useTheme } from '@/lib/context/theme-context'
import { useEffect, useState } from 'react'

export function BackgroundLayer() {
  const { backgroundMode } = useTheme()
  const [era, setEra] = useState<string | null>(null)

  // Sync era from the content div which has data-era
  useEffect(() => {
    const syncEra = () => {
      // Look for the era inside the main content to avoid picking up the background layer itself
      const contentDiv = document.querySelector('main [data-era]')
      if (contentDiv) {
        const newEra = contentDiv.getAttribute('data-era')
        if (newEra !== era) {
          console.log('Era synced:', newEra) // Helpful for debugging
          setEra(newEra)
        }
      } else if (era !== null) {
        setEra(null)
      }
    }

    // Run immediately
    syncEra()

    // Mutation observer for attribute changes
    const observer = new MutationObserver(syncEra)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-era']
    })

    // Fallback interval for navigation
    const interval = setInterval(syncEra, 500)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [era])

  return (
    <div 
      className="fixed inset-0 -z-20 overflow-hidden pointer-events-none transition-colors duration-1000 bg-paper"
      data-era={era || ''}
      data-mode={backgroundMode}
      key={`${era}-${backgroundMode}`}
    >
      {/* Aurora Mesh Layer (Pro Max) */}
      {(backgroundMode === 'artist' || backgroundMode === 'archive') && (
        <div className="absolute inset-0 overflow-hidden opacity-50 transition-opacity duration-1000">
          <div className="absolute -inset-[50%] animate-aurora opacity-30 blur-3xl bg-[radial-gradient(circle_at_20%_30%,var(--theme-accent-soft)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,var(--theme-accent-soft)_0%,transparent_50%)]" />
          <div className="absolute -inset-[50%] animate-aurora opacity-20 blur-3xl delay-700 bg-[radial-gradient(circle_at_70%_20%,var(--theme-accent)_0%,transparent_40%),radial-gradient(circle_at_30%_80%,var(--theme-accent)_0%,transparent_40%)]" />
        </div>
      )}

      {/* Dynamic Elements based on Era */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {era === '展开期' && <KiteAtmosphere />}
        {era === '后期凝练' && <KeplerAtmosphere />}
        {era === '成熟高峰' && <AgainstTheLightAtmosphere />}
        {era === '2017 时期' && <VanGoghAtmosphere />}
        {era === '出道延展' && <HappinessAtmosphere />}
        {era === '阶段平衡' && <PerfectDayAtmosphere />}
        {era === '日落' && <SunsetAtmosphere />}
      </div>
      
      {/* Subtle Grain Overlay (Pro Max Detail) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  )
}

function SunsetAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#ff7e5f]/20 via-transparent to-transparent">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,#feb47b_0%,transparent_70%)] opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#ff7e5f]/15 blur-[120px] animate-aurora" />
    </div>
  )
}

function HappinessAtmosphere() {
  return (
    <div className="absolute inset-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-accent/10 blur-xl animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            animationDelay: `${i * -1}s`,
            animationDuration: `${4 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  )
}

function PerfectDayAtmosphere() {
  return (
    <div className="absolute inset-0 bg-accent/5 animate-pulse duration-[5000ms]" />
  )
}

function KiteAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float text-accent"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 4) * 20}%`,
            animationDelay: `${i * -2}s`,
            animationDuration: `${12 + i * 3}s`,
            opacity: 0.15
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L5 9l7 7 7-7-7-7z" />
            <path d="M12 16v6" />
            <path d="M12 22l-2-2" />
            <path d="M12 22l2-2" />
            <path d="M5 9h14" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function KeplerAtmosphere() {
  return (
    <div className="absolute inset-0 bg-[#0a0a0f]/5">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  )
}

function AgainstTheLightAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[100%] opacity-30 animate-spin-slow bg-[conic-gradient(from_0deg,transparent,var(--theme-accent-soft),transparent,var(--theme-accent-soft),transparent)]" />
    </div>
  )
}

function VanGoghAtmosphere() {
  return (
    <div className="absolute inset-0 opacity-20">
       <svg width="100%" height="100%" className="filter blur-xl">
        <defs>
          <radialGradient id="swirl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          <circle
            key={i}
            cx={`${20 + Math.random() * 60}%`}
            cy={`${20 + Math.random() * 60}%`}
            r="150"
            fill="url(#swirl)"
            className="animate-swirl"
            style={{
              animationDelay: `${i * -2}s`,
              animationDuration: `${15 + i * 5}s`
            }}
          />
        ))}
      </svg>
    </div>
  )
}
