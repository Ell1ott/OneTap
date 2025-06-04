# Dark Theme Implementation with NativeWind

This project now supports comprehensive dark theme functionality using NativeWind v4. The implementation provides both automatic system theme detection and manual theme switching.

## ✨ Features

- 🌙 **Automatic System Theme Detection** - Follows device dark/light mode settings
- 🎨 **Manual Theme Switching** - Users can override system settings
- 🔄 **Seamless Theme Transitions** - CSS variables enable smooth theme changes
- 📱 **Cross-Platform Support** - Works on iOS, Android, and Web
- 🎯 **Type-Safe** - Full TypeScript support for theme values

## 🚀 Quick Start

### 1. Wrap Your App with ThemeProvider

```tsx
// App.tsx or your root component
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return <ThemeProvider defaultTheme="system">{/* Your app content */}</ThemeProvider>;
}
```

### 2. Use Theme Colors in Components

```tsx
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View className="bg-background p-4">
      <Text className="text-foreground text-lg">This text adapts to the theme!</Text>
      <View className="bg-card border-border rounded-lg border p-3">
        <Text className="text-foregroundMuted">Card content with proper theming</Text>
      </View>
    </View>
  );
}
```

### 3. Add Theme Controls

```tsx
import { ThemeToggle } from './components/ThemeToggle';

function SettingsScreen() {
  return (
    <View>
      <ThemeToggle style="buttons" />
    </View>
  );
}
```

## 🎨 Available Theme Colors

### Background Colors

- `bg-background` - Main app background
- `bg-middleground` - Secondary background (cards, modals)
- `bg-card` - Card backgrounds
- `bg-muted` - Muted background areas

### Text Colors

- `text-foreground` - Primary text
- `text-foregroundMuted` - Secondary text
- `text-mutedForeground` - Tertiary/muted text

### Accent Colors

- `bg-primary` / `text-primary` - Primary brand color
- `bg-accent` / `text-accent` - Accent/highlight color
- `bg-accentMuted` / `text-accentMuted` - Muted accent color

### UI Colors

- `border-border` - Border color
- `bg-input` / `border-input` - Input field styling
- `bg-destructive` / `text-destructive` - Error/danger states

## 🔧 Advanced Usage

### Using the Theme Hook

```tsx
import { useTheme } from './components/ThemeProvider';

function MyComponent() {
  const { theme, themeMode, setTheme, isDarkTheme } = useTheme();

  return (
    <View>
      <Text>Current theme: {theme}</Text>
      <Text>Theme mode: {themeMode}</Text>
      <Text>Is dark: {isDarkTheme ? 'Yes' : 'No'}</Text>

      <Button onPress={() => setTheme('dark')}>Switch to Dark</Button>
    </View>
  );
}
```

### Creating Custom Themed Components

```tsx
import { useTheme } from './components/ThemeProvider';

function CustomButton({ children, variant = 'primary' }) {
  const { isDarkTheme } = useTheme();

  return (
    <TouchableOpacity
      className={`
        rounded-lg p-3
        ${variant === 'primary' ? 'bg-primary' : 'bg-card border-border border'}
      `}>
      <Text
        className={`
        text-center font-medium
        ${variant === 'primary' ? 'text-background' : 'text-foreground'}
      `}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
```

## 🛠 Customization

### Modifying Theme Colors

Edit `global.css` to customize the color values:

```css
@layer base {
  :root {
    --color-primary: 220 14% 11%; /* Light theme primary */
    --color-background: 240 10% 92%; /* Light theme background */
    /* ... other colors */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: 210 40% 98%; /* Dark theme primary */
      --color-background: 222 84% 5%; /* Dark theme background */
      /* ... other colors */
    }
  }
}
```

### Adding New Theme Colors

1. Add to `global.css`:

```css
:root {
  --color-success: 142 76% 36%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-success: 142 70% 45%;
  }
}
```

2. Add to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        success: 'hsl(var(--color-success))',
      },
    },
  },
};
```

3. Update the theme utility (`utils/theme.ts`):

```ts
export const themes = {
  light: vars({
    '--color-success': '142 76% 36%',
  }),
  dark: vars({
    '--color-success': '142 70% 45%',
  }),
};
```

## 📱 Platform-Specific Notes

### iOS

- Automatic theme detection works out of the box
- Respects Control Center theme changes instantly

### Android

- Requires Android 10+ for automatic theme detection
- May need app restart on older Android versions

### Web

- Uses `prefers-color-scheme` media query
- Works with browser/OS theme settings

## 🔍 Troubleshooting

### Theme Not Updating

1. Clear Metro bundler cache: `npx expo start -c`
2. Restart development server
3. Check if using development build vs Expo Go

### Colors Not Changing

1. Ensure you're using the CSS variable color names (`bg-background` not `bg-gray-100`)
2. Verify `global.css` is imported in your app
3. Check that `ThemeProvider` is wrapping your app

### TypeScript Errors

1. Ensure `nativewind-env.d.ts` is in your project
2. Add types import to your `tsconfig.json`

## 🎬 Demo Component

Use the included `ThemeDemo` component to see all theme colors in action:

```tsx
import { ThemeDemo } from './components/ThemeDemo';

// Use in your app to test the theme
<ThemeDemo />;
```

## 📚 Examples

Check out these files for complete examples:

- `components/ThemeDemo.tsx` - Complete showcase of theme features
- `components/ThemeToggle.tsx` - Theme switching UI components
- `components/ThemeProvider.tsx` - Theme context implementation

---

Your app now has professional dark theme support! 🌟
