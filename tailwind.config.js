/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#f9f5eb',
          200: '#f2e8cc',
          300: '#e8d6a3',
          400: '#dcbe73',
          500: '#cfa64b',
          600: '#b88b39',
          700: '#966d2e',
          800: '#7a572a',
          900: '#644726',
        },
        hotel: {
          navy: '#0f172a',
          dark: '#0b0f19',
          card: '#1e293b',
          accent: '#d4af37',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}

