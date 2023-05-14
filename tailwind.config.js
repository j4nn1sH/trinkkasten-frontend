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
// <link href="https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap" rel="stylesheet">
      },
      colors: {
        "primary": "#34d399",
        "secondary": "#fecdd3",
        "positive": "#9ae282",
        "negative": "#F18383",
      }
    },
  },
  plugins: [],
}