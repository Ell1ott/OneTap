'use strict';

import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';

const baseStyle = StyleSheet.create({
  text: {
    fontFamily: 'Inter',
  },
});

export const fontStyle = baseStyle.text;
interface AppTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  f?: boolean;
  className?: string;
}

const AppText = React.forwardRef<Text, AppTextProps>(
  ({ style, children, f, className, ...props }, ref) => {
    let newStyle: TextStyle[];
    if (Array.isArray(style)) {
      newStyle = [baseStyle.text, ...style];
    } else {
      newStyle = [baseStyle.text, style].filter(Boolean) as TextStyle[];
    }

    return (
      <Text ref={ref} className={`text-foreground ${className}`} {...props} style={newStyle}>
        {children}
      </Text>
    );
  }
);

export default AppText;
