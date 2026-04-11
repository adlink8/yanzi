import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#171717',
        paper: '#faf7f2',
        muted: '#6b6b6b',
        line: '#e7dfd4',
        accent: 'var(--theme-accent)',
        'accent-soft': 'var(--theme-accent-soft)',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
      }
    }
  },
  plugins: []
}

export default config
