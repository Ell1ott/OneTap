import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { Calendar as CalendarIcon, ChevronLeft, Plus, Clock } from 'lucide-react-native';
import { useTasksStore } from 'stores/tasksStore';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';
import { Icon } from 'components/base/LucideIcon';
import { getRelativeDateString } from 'utils/dateUtils';
import { TextInput } from 'react-native-gesture-handler';

type TabType = 'Event' | 'Todo';

const SelectableText = ({
  children,
  onPress = () => {},
  isSelected = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  isSelected?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    className={`h-[2.2rem] flex-1 items-center justify-center rounded-full px-4 ${
      isSelected ? 'bg-card' : 'bg-transparent'
    }`}>
    <AppText
      className={`text-center text-base font-medium ${
        isSelected ? 'text-foreground' : 'text-foregroundMuted'
      }`}>
      {children}
    </AppText>
  </Pressable>
);

export default function EventDrawer({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('Volleyball');
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('Event');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Drawer isOpen={true} onClose={onClose} scrollEnabled={false}>
      <View className="flex-1 p-4">
        {/* Title */}
        <View className="mb-8">
          <TextInput
            className="text-3xl font-bold text-foreground outline-none placeholder:text-foreground/40"
            value={title}
            onChangeText={setTitle}
            placeholder="Event Title"
          />
        </View>

        {/* Toggle Tabs */}
        <View className="mb-8">
          <View className="flex-row rounded-full bg-background p-1.5">
            <SelectableText
              onPress={() => setActiveTab('Event')}
              isSelected={activeTab === 'Event'}>
              Event
            </SelectableText>
            <SelectableText onPress={() => setActiveTab('Todo')} isSelected={activeTab === 'Todo'}>
              <AppText
                className={`text-center font-medium ${
                  activeTab === 'Todo' ? 'text-foreground' : 'text-foregroundMuted'
                }`}>
                Todo
              </AppText>
            </SelectableText>
          </View>
        </View>

        {/* Date & Time Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center">
            <Icon icon={CalendarIcon} size={20} className="mr-2 text-foregroundMuted" />
            <AppText className="text-base font-medium text-foregroundMuted">Date & Time</AppText>
          </View>

          <View className="flex-row space-x-3">
            {/* Date */}
            <Pressable className="flex-[1.5] flex-row rounded-full bg-background p-1.5">
              <SelectableText>{formatDate(date)}</SelectableText>
            </Pressable>

            {/* Time */}
            <Pressable className="flex-[1] flex-row rounded-full bg-background p-1.5">
              <SelectableText>{formatTime(date)}</SelectableText>
            </Pressable>
          </View>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'Event' && (
          <View className="flex-1">{/* Event specific content can go here */}</View>
        )}

        {activeTab === 'Todo' && (
          <View className="flex-1">{/* Todo specific content can go here */}</View>
        )}
      </View>
    </Drawer>
  );
}

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
