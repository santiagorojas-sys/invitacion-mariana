/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        gold: {
          300: "#f0d98c",
          400: "#e6c85a",
          500: "#d4a92a",
          600: "#b8891c",
        },
      },
    },
  },
  plugins: [],
}
