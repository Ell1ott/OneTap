import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from 'components/HapticTab';
import TabBarBackground from 'components/ui/TabBarBackground';
import { Calendar, Feather, Plane, Home } from 'lucide-react-native';
import { TapadoodleBox } from 'components/tapadoodle/TapadoodleBox';
import { useTheme } from '../../components/ThemeProvider';
import { Icon } from 'components/base/LucideIcon';

// import * as ExpoCalendar from 'expo-calendar';
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
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
  //     if (status === 'granted') {
  //       const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
  //       console.log('Here are all your calendars:');
  //       console.log({ calendars });
  //     }
  //   })();
  // }, []);

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
            tabBarIcon: ({ color, focused }) => (
              <Icon
                size={25}
                icon={Feather}
                className={focused ? 'text-foreground/90' : 'text-foregroundMuted/70'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                size={25}
                icon={Home}
                className={focused ? 'text-foreground/90' : 'text-foregroundMuted/70'}
              />
            ),
            tabBarButton: (props) => (
              <View className="-m-100" style={[StyleSheet.absoluteFillObject]} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                size={25}
                icon={Calendar}
                className={focused ? 'text-foreground/90' : 'text-foregroundMuted/70'}
              />
            ),
          }}
        />
      </Tabs>

      <TapadoodleBox />
    </>
  );
}
