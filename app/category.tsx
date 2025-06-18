import CategoryDrawer from 'components/screens/CategoryDrawer';
import { router, useLocalSearchParams } from 'expo-router';

export default function Event() {
  const { id } = useLocalSearchParams();
  return (
    <CategoryDrawer
      id={id as string}
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
