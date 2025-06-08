import { View } from 'react-native';
import { Task } from './Task';
import { ChevronRight } from 'lucide-react-native';
import { Tables } from 'utils/supabase/database.types';
import { categories$ } from 'utils/supabase/SupaLegend';

export class TaskCategory extends Task {
  r: Tables<'categories'>;

  constructor(data: Tables<'categories'>) {
    super(data);
    this.r = data;
  }

  table = categories$;

  $ = () => this.table[this.r.id as string];

  isPriority = () => true;

  EndContent = () => (
    <View className="items-center justify-center self-center">
      <ChevronRight size={25} className=" text-foregroundMuted" />
    </View>
  );
}
