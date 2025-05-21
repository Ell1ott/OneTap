/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '24 24 27',
        background: '24 24 27',
        foreground: '219 219 219',
        foregroundMuted: '100 100 100',
        accent: '77 165 250',
        accentMuted: '107 165 250',
      },
    },
  },
  plugins: [],
};
