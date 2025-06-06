import CategoryDrawer from 'components/screens/CategoryDrawer';
import EventDrawer from 'components/screens/EventDrawer';
import { router, useLocalSearchParams } from 'expo-router';

export default function Event() {
  const { category } = useLocalSearchParams();
  return (
    <CategoryDrawer
      category={category as string}
      onClose={() => {
        router.back();
      }}
    />
  );
}
