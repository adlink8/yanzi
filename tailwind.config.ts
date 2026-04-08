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
        accent: '#7a5c61',
        line: '#e7dfd4'
      }
    }
  },
  plugins: []
}

export default config
