/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'header-dark': '#252B30',
        'main-background': '#F5F5F5',
        'statistic-color': '#00000073'
      }
    },
  },
  plugins: [],
}
