import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { CalendarIcon, ChevronLeft, Plus } from 'lucide-react-native';
import { useTasksStore } from 'stores/tasksStore';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';
import { Icon } from 'components/base/LucideIcon';
import { getRelativeDateString } from 'utils/dateUtils';
import { TextInput } from 'react-native-gesture-handler';
export default function EventDrawer({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());

  return (
    <Drawer isOpen={true} onClose={onClose} scrollEnabled={false}>
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

          <DateButton />
        </View>
      </ScrollView>
    </Drawer>
  );
}

const DateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateType>(new Date());
  useEffect(() => {
    console.log(date);
  }, [date]);
  return (
    <>
      <Pressable
        onPress={() => setIsOpen((prev) => !prev)}
        className={`flex-row items-center gap-2 self-start rounded-full border-[2px] border-foregroundMuted/20 p-2 px-5 ${isOpen ? '!border-blue-500' : ''}`}>
        <Icon
          icon={CalendarIcon}
          size={20}
          className={`${isOpen ? '!text-blue-500' : 'text-foregroundMuted'}`}
        />
        <AppText
          className={`text-lg font-medium ${isOpen ? '!text-blue-500' : 'text-foregroundMuted'}`}>
          {getRelativeDateString(new Date(date as string), false)
            .charAt(0)
            .toUpperCase() + getRelativeDateString(new Date(date as string), false).slice(1) ||
            new Date(date as string).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
        </AppText>
      </Pressable>
      {isOpen && <Calendar date={date} setDate={setDate} />}
    </>
  );
};

export function Calendar({ date, setDate }: { date: DateType; setDate: (date: DateType) => void }) {
  const defaultClassNames = useDefaultClassNames();
  const [selected, setSelected] = useState<DateType>();

  return (
    <DateTimePicker
      mode="single"
      date={date}
      onChange={({ date }) => setDate(date)}
      classNames={{
        ...defaultClassNames,
        selected: 'bg-blue-500 border-blue-500',
        selected_label: 'text-white',
        day: `${defaultClassNames.day} hover:bg-blue-100 p-0 m-0 rounded-xl`,
        disabled: 'opacity-50', // Make disabled dates appear more faded
        selected_month: 'bg-blue-500/50 rounded-full',
        selected_year: 'bg-blue-500/50 rounded-full',
        day_cell: 'm-0.5 aspect-square flex-none',
        day_label: 'text-base font-medium text-foreground/80',
        weekday_label: ' text-foregroundMuted',
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
