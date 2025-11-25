/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        costcoBlue: "#005CB9",
        costcoRed: "#DA1A32"
      }
    },
  },
  plugins: [],
}