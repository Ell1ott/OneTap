import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from 'components/HapticTab';
import TabBarBackground from 'components/ui/TabBarBackground';
import { Calendar, Feather, Plane } from 'lucide-react-native';
import { TapadoodleBox } from 'components/tapadoodle/TapadoodleBox';
import { useTheme } from '../../components/ThemeProvider';

export default function TabLayout() {
  const { theme } = useTheme();
  // Define theme-aware colors
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        activeTintColor: 'hsl(210, 40%, 98%)', // foreground
        inactiveTintColor: 'hsl(215, 20%, 65%)', // foregroundMuted
        backgroundColor: 'hsl(220 11% 12%)', // card
        borderColor: 'hsl(215, 27%, 17%)', // border
      };
    } else {
      return {
        activeTintColor: 'hsl(221, 39%, 11%)', // foreground
        inactiveTintColor: 'hsl(215, 14%, 34%)', // foregroundMuted
        backgroundColor: 'hsl(0, 0%, 100%)', // card (white)
        borderColor: 'hsl(214, 32%, 91%)', // border
      };
    }
  };

  const colors = getThemeColors();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.activeTintColor,
          tabBarInactiveTintColor: colors.inactiveTintColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,

          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {
              height: 70,
              backgroundColor: colors.backgroundColor,
              // borderTopColor: colors.borderColor,
              borderTopWidth: 0,
              paddingHorizontal: 30,
            },
          }),
          tabBarIconStyle: {
            height: 60,
          },
        }}
        backBehavior="history">
        <Tabs.Screen
          name="diary"
          options={{
            title: 'Diary',
            tabBarIcon: ({ color }) => <Feather size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Plane size={30} color={color} />,
            tabBarButton: (props) => (
              <View className="-m-100" style={[StyleSheet.absoluteFillObject]} />
            ),
          }}
        />
        <Tabs.Screen
          name="calender"
          options={{
            title: 'Calender',
            tabBarIcon: ({ color }) => <Calendar size={30} color={color} />,
          }}
        />
      </Tabs>
      <TapadoodleBox />
    </>
  );
}
