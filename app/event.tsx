import EventDrawer from 'components/screens/EventDrawer';
import { router, useLocalSearchParams } from 'expo-router';
import { useTasksStore } from 'stores/tasksStore';

export default function Event() {
  const { id } = useLocalSearchParams();

  const event = useTasksStore((state) => state.tasks.find((event) => event.id === id));
  return (
    <EventDrawer
      event={event}
      onClose={() => {
        router.back();
      }}
    />
  );
}
