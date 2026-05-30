export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      letterSpacing: {
        '04em': '0.4em',
        '03em': '0.3em',
      },
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          light: '#e5c558', // Lightened for hover if needed
        },
        maudel: {
          dark: '#041a14',
          darker: '#020d0a',
          emerald: '#064e3b', // Custom emerald shade if different from standard
        },
        cream: '#fcfcf9',
        paper: '#f8f9fa',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Ensure this font is loaded in index.html or imports
      },
    },
  },
  plugins: [],
}

