import EventDrawer from 'components/EventDrawer';
import { router } from 'expo-router';

export default function Event() {
  return (
    <EventDrawer
      onClose={() => {
        router.back();
      }}
    />
  );
}
