// .cjs (not .js): tailwindcss v3 loads this config via Node's CommonJS
// `require()` internally, which cannot parse an ES module — and this
// package's package.json sets "type": "module", so a plain .js file here
// would be treated as ESM and fail to load.
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f1fe',
          100: '#e6e4fd',
          200: '#cac5fb',
          300: '#a79ef7',
          400: '#8b7ff3',
          500: '#7c5cec',
          600: '#6d3fde',
          700: '#5c30c4',
          800: '#4c299f',
          900: '#3f2481',
          950: '#251552',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'slide-up': 'slide-up 200ms ease-out',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [typography],
};
