import { categories$ } from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import CategoryShare from './CategoryShare';
import CategoryList from './CategoryList';

const CategoryContent = observer(
  ({ id, action, onClose }: { id: string; action: 'share' | null; onClose: () => void }) => {
    const category$ = categories$[id];
    const category = category$.get();

    if (action === 'share' && !category) {
      return <CategoryShare id={id} />;
    }

    return <CategoryList id={id} onClose={onClose} />;
  }
);

export default CategoryContent;
