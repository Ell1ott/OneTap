import { Text, View } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter/useFonts';
import { Inter_100Thin } from '@expo-google-fonts/inter/100Thin';
import { Inter_200ExtraLight } from '@expo-google-fonts/inter/200ExtraLight';
import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
import { Inter_100Thin_Italic } from '@expo-google-fonts/inter/100Thin_Italic';
import { Inter_200ExtraLight_Italic } from '@expo-google-fonts/inter/200ExtraLight_Italic';
import { Inter_300Light_Italic } from '@expo-google-fonts/inter/300Light_Italic';
import { Inter_400Regular_Italic } from '@expo-google-fonts/inter/400Regular_Italic';
import { Inter_500Medium_Italic } from '@expo-google-fonts/inter/500Medium_Italic';
import { Inter_600SemiBold_Italic } from '@expo-google-fonts/inter/600SemiBold_Italic';
import { Inter_700Bold_Italic } from '@expo-google-fonts/inter/700Bold_Italic';
import { Inter_800ExtraBold_Italic } from '@expo-google-fonts/inter/800ExtraBold_Italic';
import { Inter_900Black_Italic } from '@expo-google-fonts/inter/900Black_Italic';

export default () => {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Inter_100Thin_Italic,
    Inter_200ExtraLight_Italic,
    Inter_300Light_Italic,
    Inter_400Regular_Italic,
    Inter_500Medium_Italic,
    Inter_600SemiBold_Italic,
    Inter_700Bold_Italic,
    Inter_800ExtraBold_Italic,
    Inter_900Black_Italic,
  });

  let fontSize = 24;
  let paddingVertical = 6;

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_100Thin',
          }}>
          Inter Thin
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_200ExtraLight',
          }}>
          Inter Extra Light
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_300Light',
          }}>
          Inter Light
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_400Regular',
          }}>
          Inter Regular
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_500Medium',
          }}>
          Inter Medium
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_600SemiBold',
          }}>
          Inter Semi Bold
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_700Bold',
          }}>
          Inter Bold
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_800ExtraBold',
          }}>
          Inter Extra Bold
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_900Black',
          }}>
          Inter Black
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_100Thin_Italic',
          }}>
          Inter Thin Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_200ExtraLight_Italic',
          }}>
          Inter Extra Light Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_300Light_Italic',
          }}>
          Inter Light Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_400Regular_Italic',
          }}>
          Inter Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_500Medium_Italic',
          }}>
          Inter Medium Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_600SemiBold_Italic',
          }}>
          Inter Semi Bold Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_700Bold_Italic',
          }}>
          Inter Bold Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_800ExtraBold_Italic',
          }}>
          Inter Extra Bold Italic
        </Text>
        <Text
          style={{
            fontSize,
            paddingVertical,
            // Note the quoting of the value for `fontFamily` here; it expects a string!
            fontFamily: 'Inter_900Black_Italic',
          }}>
          Inter Black Italic
        </Text>
      </View>
    );
  }
};
