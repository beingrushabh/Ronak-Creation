import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B0000', // maroon
          light: '#C05050',
          dark: '#4B0000',
        },
        secondary: {
          DEFAULT: '#D4AF37', // gold
        },
        background: {
          DEFAULT: '#F9F5F1', // warm neutral
        },
      },
    },
  },
  plugins: [],
}

export default config