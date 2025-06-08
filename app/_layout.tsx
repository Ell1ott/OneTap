import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import '../global.css';
import '../utils/polyfills';
import { useEffect } from 'react';
import { useTasksStore } from 'stores/tasksStore';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from 'sonner-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import '../assets/font.css';
import { Tables } from 'utils/database.types';
import { todos$ as _todos$ } from '../utils/SupaLegend';
import { observer } from '@legendapp/state/react';
const Todos = observer(({ todos$ }: { todos$: typeof _todos$ }) => {
  // Get the todos from the state and subscribe to updates
  const todos = todos$.get();
  const renderItem = ({ item: todo }: { item: Tables<'todos'> }) => <Todo todo={todo} />;
  if (todos)
    return <FlatList data={Object.values(todos)} renderItem={renderItem} style={styles.todos} />;

  return <></>;
});

export default function RootLayout() {
  const loadTasks = useTasksStore((state) => state.loadTasks);
  useEffect(() => {
    loadTasks();
  }, []);

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
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <Toaster position="bottom-center" swipeToDismissDirection="left" offset={80} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
