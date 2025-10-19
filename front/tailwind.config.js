/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'halloween-purple': '#6B21A8',
        'halloween-orange': '#F97316',
        'halloween-black': '#0F0F0F',
        'success': '#10B981',
        'error': '#EF4444',
      },
      fontFamily: {
        creepster: ['Creepster', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
