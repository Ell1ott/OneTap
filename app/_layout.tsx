import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import '../global.css';
import '../utils/polyfills';
import 'react-native-get-random-values';
import { useEffect } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../assets/font.css';
import { signInAnonymously, supabase } from 'utils/supabase/SupaLegend';
import { v4 as uuidv4 } from 'uuid';
export default function RootLayout() {
  console.log(uuidv4());
  useEffect(() => {
    // signInAnonymously().then((data) => {
    //   console.log(data);
    // });
  }, []);

  supabase.auth.onAuthStateChange((e, s) => {
    console.log("new sb event", e, s)
    setTimeout(() => {

      router.push("/auth")
    }, 100);
  })

  console.log("auth", supabase.auth)


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
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="event"
            options={{ presentation: 'transparentModal', headerShown: false }}
          />
          <Stack.Screen name="auth" options={{ headerShown: false, presentation: 'transparentModal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <Toaster position="bottom-center" swipeToDismissDirection="left" offset={80} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
