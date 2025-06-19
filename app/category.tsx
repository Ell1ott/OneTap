import Drawer from 'components/base/Drawer';
import CategoryDrawer from 'components/screens/CategoryDrawer';
import { router, useLocalSearchParams } from 'expo-router';

export default function Event() {
  const { id, action } = useLocalSearchParams();

  return (
    <CategoryDrawer
      id={id as string}
      action={action as 'share' | null}
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
