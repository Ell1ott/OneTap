import { useTheme } from 'components/ThemeProvider';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';

type SplitMode = 'words' | 'characters' | 'sentences';

interface FadeInTextProps {
  /** The text to display with fade-in animation */
  text: string;
  /** How to split the text for animation - 'words', 'characters', or 'sentences' */
  splitMode?: SplitMode;
  /** CSS class name for styling */
  className?: string;
  /** Duration of fade-in animation in milliseconds */
  animationDuration?: number;
  /** Callback for text layout measurements */
  onLayout?: (event: any) => void;
  /** Content to show when text is empty */
  fallbackContent?: React.ReactNode;
  /** Opacity of the text when it is fully faded in */
  endOpacity?: number;
}

/**
 * FadeInText - A reusable component for animating text with fade-in effects
 *
 * Example usage:
 * ```tsx
 * <FadeInText
 *   text="Hello beautiful world!"
 *   splitMode="words"
 *   className="text-lg text-blue-500"
 *   animationDuration={500}
 *   fallbackContent={<Text>Loading...</Text>}
 * />
 * ```
 */
export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  splitMode = 'words',
  className = '',
  animationDuration = 350,
  onLayout,
  fallbackContent,
  endOpacity = 1,
}) => {
  // Store animation values in a ref to persist across renders
  const animationsRef = useRef<Map<string, Animated.Value>>(new Map());
  const textRef = useRef<Text>(null);
  const [currentText, setCurrentText] = useState<string>('');

  const { theme } = useTheme();
  const foreground = theme === 'light' ? '0,0,0' : '255,255,255';

  // Update current text when text prop changes
  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  // Helper function to split text based on split mode
  const splitText = (inputText: string): string[] => {
    if (!inputText.trim()) return [];

    switch (splitMode) {
      case 'characters':
        return inputText.split('');
      case 'sentences':
        return inputText.split(/(?<=[.!?])\s+/).filter(Boolean);
      case 'words':
      default:
        return inputText.trim().split(/\s+/).filter(Boolean);
    }
  };

  // Helper function to get or create an animation value for a specific text segment
  const getAnimationValue = (segmentKey: string): Animated.Value => {
    if (!animationsRef.current.has(segmentKey)) {
      const anim = new Animated.Value(0);
      animationsRef.current.set(segmentKey, anim);

      // Start fade-in animation
      Animated.timing(anim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: false, // Need to disable native driver for color interpolation
      }).start();
    }

    return animationsRef.current.get(segmentKey)!;
  };

  const textSegments = splitText(currentText);

  if (textSegments.length === 0) {
    return fallbackContent;
  }

  return (
    <Text ref={textRef} onLayout={onLayout} className={className}>
      {textSegments.map((segment, index) => {
        const segmentKey = `segment-${index}-${segment}`;
        const animValue = getAnimationValue(segmentKey);

        // Use color interpolation for fade-in effect
        const textColor = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [`rgba(${foreground},0)`, `rgba(${foreground},${endOpacity})`],
        });

        const separator = splitMode === 'characters' ? '' : ' ';
        const isLast = index === textSegments.length - 1;

        return (
          <Animated.Text key={segmentKey} style={{ color: textColor }}>
            {segment}
            {!isLast ? separator : ''}
          </Animated.Text>
        );
      })}
    </Text>
  );
};

export default FadeInText;
