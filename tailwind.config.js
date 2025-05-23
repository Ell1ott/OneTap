/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '24 24 27',
        background: '#FFFFFF',
        foreground: '#111827',
        foregroundMuted: '#4b5563',
        accent: '#42A0F3',
        accentMuted: '107 165 250',
      },
    },
  },
  plugins: [],
};
