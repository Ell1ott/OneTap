import { EventDrawer } from 'components/screens/EventDrawer';
import { router, useLocalSearchParams } from 'expo-router';

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
