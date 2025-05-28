import { Platform, StyleSheet, View } from 'react-native';

import AppText from 'components/base/AppText';
import { RichTextEditor } from 'components/diary/RichTextEditor';

export default function TabTwoScreen() {
  return <RichTextEditor />;
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
