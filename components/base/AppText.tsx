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
}

const AppText = React.forwardRef<Text, AppTextProps>(({ style, children, f, ...props }, ref) => {
  let newStyle: TextStyle[];
  if (Array.isArray(style)) {
    newStyle = [baseStyle.text, ...style];
  } else {
    newStyle = [baseStyle.text, style].filter(Boolean) as TextStyle[];
  }

  return (
    <Text ref={ref} {...props} style={newStyle}>
      {children}
    </Text>
  );
});

export default AppText;
