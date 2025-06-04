import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  size?: number;
}

export function ThemeToggle({ size = 20 }: ThemeToggleProps) {
  const { theme, themeMode, setTheme } = useTheme();

  const themes = ['light', 'dark', 'system'] as const;
  const icons = { light: Sun, dark: Moon, system: Monitor };

  const IconComponent = icons[themeMode];

  // Get the actual color value based on current theme
  const iconColor =
    theme === 'dark'
      ? 'hsl(215, 20%, 65%)' // foregroundMuted dark
      : 'hsl(215, 14%, 34%)'; // foregroundMuted light

  const nextTheme = () => {
    const currentIndex = themes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
  // this is just a fun comment, to remind me not to take life too ser
  return (
    <TouchableOpacity onPress={nextTheme} className="mt-5">
      <IconComponent size={size} color={iconColor} />
    </TouchableOpacity>
  );
}

// Simple component showing current theme info
export function ThemeInfo() {
  const { theme, themeMode } = useTheme();

  return (
    <View className="rounded-lg border border-border bg-card p-4">
      <Text className="mb-2 font-semibold text-foreground">Theme Status</Text>
      <Text className="text-foregroundMuted">
        Mode: {themeMode} | Active: {theme}
      </Text>
    </View>
  );
}
