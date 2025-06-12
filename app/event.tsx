import { EventDrawer } from 'components/screens/EventEditor/EventDrawer/EventDrawer';
import { router, useLocalSearchParams } from 'expo-router';
import { events$ } from 'utils/supabase/SupaLegend';
import { Event } from 'components/Todos/classes/Event';

export default function EventRoute() {
  const { id } = useLocalSearchParams();

  return (
    <EventDrawer
      id={id as string}
      onClose={() => {
        router.back();
      }}
    />
  );
}
