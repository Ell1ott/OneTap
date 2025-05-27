import { View } from 'react-native';
import { Task } from './Task';
import { ChevronRight } from 'lucide-react-native';

export class TaskCategory extends Task {
  constructor(data: Partial<TaskCategory> & { id: string; title: string }) {
    super(data);
  }

  isPriority = () => true;

  renderEndContent = () => (
    <View className="items-center justify-center self-center">
      <ChevronRight size={25} className=" text-foregroundMuted" />
    </View>
  );
}
