import CategoryDrawer from 'components/screens/CategoryDrawer';
import { router, useLocalSearchParams } from 'expo-router';

export default function Event() {
  const { category } = useLocalSearchParams();
  return (
    <CategoryDrawer
      category={category as string}
      onClose={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push('/');
        }
      }}
    />
  );
}
