/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mining: {
          950: '#070a12',
          900: '#0d1322',
          850: '#11192e',
          800: '#18233c',
          700: '#233252',
          600: '#334771',
          accent: '#0284c7',
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#ef4444',
          cyan: '#06b6d4',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
