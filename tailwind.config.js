/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'primaryFont' : ['Montserrat'],
        'secondaryFont' : ['Signika Negative'],
        'lumanosimo' : ['Lumanosimo']
        
      }
    },
  },
  plugins: [],
}

