/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'amatic': ['Amatic SC', 'cursive'],
      },
      colors: {
        "primary": "#34d399",
        "secondary": "#fecdd3",
        "positive": "#5cb85c",
        "negative": "#d9534f",
        "muted" : "#6c757d",
      }
    },
  },
  plugins: [],
}