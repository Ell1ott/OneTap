import { Platform } from 'react-native';

// Get screen width - for web, calculate based on CSS media query rules
export const getActualWidth = (_screenWidth: number, _screenHeight: number) => {
  if (Platform.OS === 'web') {
    const aspectRatio = _screenWidth / _screenHeight;

    // Check if we're in the desktop layout (min-aspect-ratio: 3/4)
    if (aspectRatio >= 3 / 4) {
      // Calculate the clamp(350px, 43vh, 430px) value
      const viewportHeight = _screenHeight;
      const clampedWidth = Math.max(350, Math.min(0.43 * viewportHeight, 430));
      return clampedWidth;
    }

    // Mobile web layout - use full width
    return _screenWidth;
  }

  // Native mobile - subtract 10px as before
  return _screenWidth - 10;
};

// Get screen height - for web, calculate based on CSS media query rules
export const getActualHeight = (_screenWidth: number, _screenHeight: number) => {
  if (Platform.OS === 'web') {
    const aspectRatio = _screenWidth / _screenHeight;

    // Check if we're in the desktop layout (min-aspect-ratio: 3/4)
    if (aspectRatio >= 3 / 4) {
      // Calculate max-height: 93vh and respect aspect-ratio: 9 / 19.5
      const maxHeight = 0.93 * _screenHeight;
      const width = getActualWidth(_screenWidth, _screenHeight);
      const aspectRatioHeight = (width * 19.5) / 9;
      return Math.min(maxHeight, aspectRatioHeight);
    }

    // Mobile web layout - use full height
    return _screenHeight;
  }

  // Native mobile - use full height
  return _screenHeight;
};
