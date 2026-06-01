import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        rsa: {
          bronze: '#D4AF37',
          charcoal: '#2B2625',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(43, 38, 37, 0.08)',
        'card-lg': '0 20px 50px -12px rgba(43, 38, 37, 0.15)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to bottom right, #0c0a09, #1c1917, #0f172a)',
        'gradient-cta': 'linear-gradient(to right, #d97706, #eab308)',
      },
    },
  },
  plugins: [],
}
export default config
