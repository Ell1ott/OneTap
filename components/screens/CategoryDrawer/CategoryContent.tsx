import { categories$ } from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import CategoryShare from './CategoryShare';
import CategoryList from './CategoryList';
import AppText from 'components/base/AppText';
import { View } from 'react-native';

const CategoryContent = observer(
  ({ id, action, onClose }: { id: string; action: 'share' | null; onClose: () => void }) => {
    const category$ = categories$[id];
    const category = category$.get();

    if (action === 'share' && !category) {
      return <CategoryShare id={id} />;
    }

    if (!category) {
      return (
        <View className="flex-1 items-center justify-center">
          <AppText>Category not found</AppText>
        </View>
      );
    }

    return <CategoryList id={id} onClose={onClose} />;
  }
);

export default CategoryContent;
