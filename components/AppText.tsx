'use strict';

import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';

const baseStyle = StyleSheet.create({
  text: {
    fontFamily: 'Inter',
  },
});

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  f?: boolean;
}

const AppText = ({ style, children, f, ...props }: AppTextProps) => {
  let newStyle: TextStyle[];
  if (Array.isArray(style)) {
    newStyle = [baseStyle.text, ...style];
  } else {
    newStyle = [baseStyle.text, style].filter(Boolean) as TextStyle[];
  }

  return (
    <Text {...props} style={newStyle}>
      {children}
    </Text>
  );
};

export default AppText;
