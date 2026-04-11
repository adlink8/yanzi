'use client'

import { useTheme, type BackgroundMode } from '@/lib/context/theme-context'
import { useState } from 'react'

export function ThemeSwitcher() {
  const { backgroundMode, setBackgroundMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const modes: { value: BackgroundMode; label: string; icon: string }[] = [
    { value: 'pure', label: '纯净', icon: '📄' },
    { value: 'artist', label: '人物', icon: '👤' },
    { value: 'archive', label: '专辑', icon: '🎨' },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => {
                setBackgroundMode(mode.value)
                setIsOpen(false)
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-lg transition-all ${
                backgroundMode === mode.value
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink hover:bg-paper border border-line'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-xl hover:scale-105 transition-transform active:scale-95"
        aria-label="切换背景模式"
      >
        <span className="text-xl">{isOpen ? '✕' : '✨'}</span>
      </button>
    </div>
  )
}
