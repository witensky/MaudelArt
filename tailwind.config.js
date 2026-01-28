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
    },
  },
  plugins: [],
}
