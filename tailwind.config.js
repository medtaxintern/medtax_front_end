/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.js",
    "./components/**/*.js",
  ],
  theme: {
    extend: {
      colors:{
        charcoal: '#2c2d2d',
        light_charcoal: '#282929',
      }
    },
    
  },
  plugins: [],
}

