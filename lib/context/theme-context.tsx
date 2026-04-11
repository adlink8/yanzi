'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type BackgroundMode = 'pure' | 'artist' | 'archive'

type ThemeContextType = {
  backgroundMode: BackgroundMode
  setBackgroundMode: (mode: BackgroundMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('pure')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('backgroundMode') as BackgroundMode
    if (saved && ['pure', 'artist', 'archive'].includes(saved)) {
      setBackgroundMode(saved)
    }
  }, [])

  // Save to localStorage on change
  const handleSetMode = (mode: BackgroundMode) => {
    setBackgroundMode(mode)
    localStorage.setItem('backgroundMode', mode)
  }

  return (
    <ThemeContext.Provider value={{ backgroundMode, setBackgroundMode: handleSetMode }}>
      <div data-mode={backgroundMode} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
