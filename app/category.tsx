import CategoryDrawer from 'components/CategoryDrawer';
import EventDrawer from 'components/EventDrawer';
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
