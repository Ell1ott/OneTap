import { vars } from 'nativewind';

/**
 * Theme utility for managing light and dark themes in the app
 * Supports both automatic system theme detection and manual theme switching
 */

// Theme definitions using nativewind vars for manual theme switching
export const themes = {
  light: vars({
    '--color-primary': '220 14% 11%',
    '--color-background': '216 25% 96%',
    '--color-card': '0 0% 100%',
    '--color-foreground': '221 39% 11%',
    '--color-foreground-muted': '215 14% 50%',
    '--color-accent': '208 88% 61%',
    '--color-accent-muted': '214 71% 74%',
    '--color-border': '214 32% 91%',
    '--color-input': '214 32% 91%',
    '--color-ring': '214 71% 74%',
    '--color-muted': '210 40% 96%',
    '--color-muted-foreground': '215 20% 35%',
    '--color-destructive': '0 84% 60%',
    '--color-destructive-foreground': '210 40% 98%',
  }),
  dark: vars({
    '--color-primary': '210 40% 98%',
    '--color-background': '222 17% 7%',
    '--color-card': '220 11% 12%',
    '--color-foreground': '210 40% 98%',
    '--color-foreground-muted': '215 20% 65%',
    '--color-accent': '210 83% 59%',
    '--color-accent-muted': '214 71% 74%',
    '--color-border': '215 27% 17%',
    '--color-input': '215 27% 17%',
    '--color-ring': '214 71% 74%',
    '--color-muted': '220 14% 11%',
    '--color-muted-foreground': '215 20% 65%',
    '--color-destructive': '0 84% 60%',
    '--color-destructive-foreground': '210 40% 98%',
  }),
};

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';
