import { EventDrawer } from 'components/screens/EventEditor/EventDrawer';
import { router, useLocalSearchParams } from 'expo-router';

export default function EventRoute() {
  const { id } = useLocalSearchParams();

  return (
    <EventDrawer
      id={id as string}
      onClose={() => {
        if (router.canGoBack()) router.back();
        else router.push('/');
      }}
    />
  );
}
