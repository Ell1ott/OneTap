import { Image } from 'expo-image';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import AppText from 'components/base/AppText';

export default function TabTwoScreen() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <AppText>Explore</AppText>
      </View>
      <TextInput className="rounded-md border-2 border-gray-300 p-2" />
    </View>
  );
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
