import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Nohemi', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        body:    ['DM Sans', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      letterSpacing: {
        'nohemi': '-0.03em',
        'nohemi-tight': '-0.05em',
      }
    },
  },
}
export default config
