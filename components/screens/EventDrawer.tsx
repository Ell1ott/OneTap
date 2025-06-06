import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { CalendarIcon, ChevronLeft, Plus } from 'lucide-react-native';
import { useTasksStore } from 'stores/tasksStore';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';
import { Icon } from 'components/base/LucideIcon';
export default function EventDrawer({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());

  return (
    <Drawer isOpen={true} onClose={onClose}>
      <ScrollView
        className="flex-none rounded-t-3xl bg-card"
        style={{
          height: 2000,
        }}
        contentContainerClassName="px-6 pt-16 pb-6 flex-1 h-[100rem]"
        keyboardDismissMode="on-drag">
        {/* Header */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center">
            <TextInput
              className="text-3xl font-bold text-foreground outline-none placeholder:text-foreground/40"
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
            />
          </View>
          <View className="flex-row items-center gap-2 self-start rounded-full border-[2px] border-foregroundMuted/20 p-2 px-5">
            <Icon icon={CalendarIcon} size={20} className="color-foregroundMuted" />
            <AppText className="text-lg font-medium text-foregroundMuted">Today</AppText>
          </View>
          {/* <Calendar /> */}
        </View>
      </ScrollView>
    </Drawer>
  );
}

export function Calendar() {
  const defaultClassNames = useDefaultClassNames();
  const [selected, setSelected] = useState<DateType>();

  return (
    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) => setSelected(date)}
      classNames={{
        ...defaultClassNames,
        selected: 'bg-blue-500 border-blue-500',
        selected_label: 'text-white',
        day: `${defaultClassNames.day} hover:bg-blue-100 p-0 m-0 flex-none rounded-xl`,
        disabled: 'opacity-50', // Make disabled dates appear more faded
        selected_month: 'bg-blue-500/50 rounded-full',
        selected_year: 'bg-blue-500/50 rounded-full',
        day_cell: 'm-0.5 aspect-square flex-none',
        day_label: 'text-base font-medium',
        today: 'text-blue-500 border-blue-500 border-[3px]',
        today_label: 'text-blue-500',
      }}
      styles={{
        day: {
          // flex: 'none',
          height: 32,
        },
        day_cell: {
          flex: 'none',
          height: 32,
        },
      }}
    />
  );
}
