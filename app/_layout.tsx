import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import '../global.css';
import '../utils/polyfills';
import { useEffect } from 'react';
import { useTasksStore } from 'stores/tasksStore';
import { ThemeProvider } from '../components/ThemeProvider';
import { createNotifications } from 'react-native-notificated';
const { NotificationsProvider, useNotifications, ...events } = createNotifications();
export default function RootLayout() {
  const loadTasks = useTasksStore((state) => state.loadTasks);
  useEffect(() => {
    loadTasks();
  }, []);

  const { notify } = useNotifications();

  useEffect(() => {
    const notificationMetadata = notify('success', {
      params: {
        title: 'Hello',
        description: 'Wow, that was easy',
      },
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <NotificationsProvider>
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
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </NotificationsProvider>
    </ThemeProvider>
  );
}
