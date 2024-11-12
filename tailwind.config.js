/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'kitchen-blue': '#499CA6',
        'kitchen-yellow': '#F2E5A2',
        'kitchen-orange': '#F2762E',
        'kitchen-red': '#D91604',
        'kitchen-beige': '#D98282',
      }
    },
  },
  plugins: [],
}

