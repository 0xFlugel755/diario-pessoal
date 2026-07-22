/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff5fb',
          100: '#ffe4f3',
          200: '#ffc9e8',
          300: '#f5a8d8',
        },
        purple: {
          50: '#faf5ff',
          100: '#f0e0ff',
          200: '#dcc2ff',
          300: '#c7a3f5',
          400: '#a97ee0',
          500: '#8f5fd1',
          600: '#7546b8',
          700: '#5f379a',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
