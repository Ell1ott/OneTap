import EventDrawer from 'components/screens/EventDrawer';
import { router, useLocalSearchParams } from 'expo-router';
import { useTasksStore } from 'stores/tasksStore';
import { events$ } from 'utils/supabase/SupaLegend';
import { Event } from 'components/Todos/classes/Event';

export default function EventRoute() {
  const { id } = useLocalSearchParams();

  const event = new Event(events$[id].get());
  return (
    <EventDrawer
      event={event}
      onClose={() => {
        router.back();
      }}
    />
  );
}
