module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
}
