import { presets } from 'frappe-ui'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [presets],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // minimalist neutrals — main UI surfaces & text
        stone: {
          50: '#FAFAF8',
          100: '#F2F1EC',
          200: '#E5E3DA',
          300: '#D1CEC0',
          400: '#A8A399',
          500: '#7A756A',
          600: '#57534A',
          700: '#3D3A33',
          800: '#262420',
          900: '#161512',
        },
        // deep green accent — CTAs, badges, active states
        pine: {
          50: '#EAF0EA',
          100: '#CBDACB',
          200: '#9FBB9F',
          300: '#6E9970',
          400: '#43764A',
          500: '#2C5A34',
          600: '#204327',
          700: '#17321D',
          800: '#102214',
          900: '#0A160D',
        },
        ink: '#0F0F0E', // near-black for headings/nav
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Fraunces', 'serif'], // optional editorial serif for hero/product titles
      },
    },
  },
  plugins: [],
}
