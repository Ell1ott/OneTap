import Drawer from 'components/base/Drawer';
import CategoryContent from './CategoryDrawer/CategoryContent';

const CategoryDrawer = ({
  id,
  onClose,
  action,
}: {
  id: string;
  onClose: () => void;
  action: 'share' | null;
}) => {
  return (
    <Drawer isOpen={!!id} onClose={onClose} scrollEnabled={true} className="bg-background">
      <CategoryContent id={id} action={action} onClose={onClose} />
    </Drawer>
  );
};

export default CategoryDrawer;
