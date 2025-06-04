/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './app/**/*.{js,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
        background: 'hsl(var(--color-background))',
        middleground: 'hsl(var(--color-middleground))',
        foreground: 'hsl(var(--color-foreground))',
        foregroundMuted: 'hsl(var(--color-foreground-muted))',
        accent: 'hsl(var(--color-accent))',
        accentMuted: 'hsl(var(--color-accent-muted))',
        card: 'hsl(var(--color-card))',
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-input))',
        ring: 'hsl(var(--color-ring))',
        muted: 'hsl(var(--color-muted))',
        mutedForeground: 'hsl(var(--color-muted-foreground))',
        destructive: 'hsl(var(--color-destructive))',
        destructiveForeground: 'hsl(var(--color-destructive-foreground))',
      },
    },
  },
  plugins: [],
};
