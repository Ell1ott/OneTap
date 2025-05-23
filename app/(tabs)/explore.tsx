import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import AppText from 'components/AppText';

export default function TabTwoScreen() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <AppText>Explore</AppText>
      </View>
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
