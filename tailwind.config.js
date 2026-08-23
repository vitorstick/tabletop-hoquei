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
        rink: {
          wood: '#d4a373',
          woodDark: '#bc8a5f',
          lineRed: '#ef233c',
          lineBlue: '#0077b6',
          lineWhite: '#f8f9fa',
          crease: '#e9ecef',
          border: '#343a40'
        },
        tactical: {
          home: '#e63946',
          homeDark: '#b51724',
          away: '#1d3557',
          awayDark: '#0f1d31',
          ball: '#ff7b00',
          zone: '#3a86ff'
        }
      },
      boxShadow: {
        'token': '0 4px 14px 0 rgba(0, 0, 0, 0.45)',
        'token-selected': '0 0 0 3px rgba(255, 215, 0, 0.9), 0 8px 20px 0 rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
