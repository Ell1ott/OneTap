import {
  router,
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler';
import '../global.css';
import '../utils/polyfills';
import 'react-native-get-random-values';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from 'sonner-native';
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../assets/font.css';
import { signInAnonymously, supabase } from 'utils/supabase/SupaLegend';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function RootLayout() {
  const pathname = usePathname();
  const params = useLocalSearchParams();
  console.log(uuidv4());
  useEffect(() => {
    // signInAnonymously().then((data) => {
    //   console.log(data);
    // });
  }, []);

  const [openAuth, setOpenAuth] = useState(false);

  supabase.auth.onAuthStateChange((e, s) => {
    console.log('new sb event', e, s);
    if (e === 'INITIAL_SESSION' && !s) {
      setOpenAuth(true);
    }
  });
  useEffect(() => {
    const redirectToAuth = async () => {
      const fullPathname =
        pathname +
        (Object.keys(params).length > 0 ? '?' + new URLSearchParams(params as any).toString() : '');
      await AsyncStorage.setItem('redirectUrl', fullPathname);
      if (openAuth) {
        router.push('/auth');
      }
    };
    redirectToAuth();
  }, [openAuth]);

  return (
    <GestureHandlerRootView className="">
      <ThemeProvider defaultTheme="system">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="category"
            options={{
              headerShown: false,
              presentation: 'transparentModal',
            }}
          />
          <Stack.Screen
            name="event"
            options={{ presentation: 'transparentModal', headerShown: false }}
          />
          <Stack.Screen
            name="auth"
            options={{ headerShown: false, presentation: 'transparentModal' }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <Toaster position="bottom-center" swipeToDismissDirection="left" offset={80} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
