import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';
import { Icon } from 'components/base/LucideIcon';
import { TextInput } from 'react-native-gesture-handler';
import { observer } from '@legendapp/state/react';
import { events$ } from 'utils/supabase/SupaLegend';

type TabType = 'Event' | 'Todo';

const formatDate = (date: Date) => {
  if (date.getFullYear() === new Date().getFullYear()) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  }
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const SelectableText = ({
  children,
  onPress = () => { },
  isSelected = false,
  pressable = true,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  isSelected?: boolean;
  pressable?: boolean;
}) => (
  <Pressable
    disabled={!pressable}
    onPress={onPress}
    className={`h-[2rem] flex-1 items-center justify-center rounded-full px-4 ${isSelected && pressable ? 'bg-card' : 'bg-transparent'
      }`}>
    <AppText
      className={`text-center font-medium ${isSelected ? 'text-foreground' : 'text-foregroundMuted'
        }`}>
      {children}
    </AppText>
  </Pressable>
);

export const EventDrawer = observer(({ onClose, id }: { onClose: () => void; id: string }) => {
  const event$ = events$[id];
  const [title, setTitle] = useState(event$.title);
  const [date, setDate] = useState();
  const [activeTab, setActiveTab] = useState<TabType>('Event');

  return (
    <Drawer isOpen={true} onClose={onClose} scrollEnabled={false} className="bg-card">
      <View className="flex-1">
        {/* Title */}
        <View className="mb-6">
          <TextInput
            className="text-3xl font-bold leading-none text-foreground outline-none placeholder:text-foreground/40"
            value={event$.title.get() || ''}
            onChangeText={(text) => {
              event$.updated_at.set(new Date().toISOString());
              event$.title.set(text);
            }}
            placeholder="Event Title"
          />
        </View>

        {/* Toggle Tabs */}
        <View className="mb-6">
          <View className="flex-row rounded-full bg-background p-1.5">
            <SelectableText
              onPress={() => setActiveTab('Event')}
              isSelected={activeTab === 'Event'}>
              Event
            </SelectableText>
            <SelectableText onPress={() => setActiveTab('Todo')} isSelected={activeTab === 'Todo'}>
              <AppText
                className={`text-center font-medium ${activeTab === 'Todo' ? 'text-foreground' : 'text-foregroundMuted'
                  }`}>
                Todo
              </AppText>
            </SelectableText>
          </View>
        </View>
        <DateTime
          date={new Date(event$.start[0].date.get() as string)}
          setDate={(date) => {
            console.log('ddd', date);

            event$.start[0].date.set(new Date(date).toISOString());
          }}
        />

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
});

export function DateTime({ date, setDate }: { date: DateType; setDate: (date: Date) => void }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  useEffect(() => {
    console.log(calendarOpen);
  }, [calendarOpen]);
  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center">
        <Icon icon={CalendarIcon} size={20} className="mr-2 text-foregroundMuted" />
        <AppText className="text-base font-medium text-foregroundMuted">Date & Time</AppText>
      </View>

      <View className="mb-2 flex-row space-x-3">
        {/* Date */}
        <Pressable
          onPress={() => setCalendarOpen(!calendarOpen)}
          className={`flex-[1.5] flex-row rounded-full bg-background p-1.5 ${calendarOpen ? 'bg-foreground/15' : ''
            }`}>
          <SelectableText pressable={false} isSelected={calendarOpen}>
            {formatDate(date as Date)}
          </SelectableText>
        </Pressable>

        {/* Time */}
        <Pressable className="flex-[1] flex-row rounded-full bg-background p-1.5">
          <SelectableText>{formatTime(date as Date)}</SelectableText>
        </Pressable>
      </View>
      {calendarOpen && <Calendar date={date} setDate={setDate} />}
    </View>
  );
}

export function Calendar({ date, setDate }: { date: DateType; setDate: (date: Date) => void }) {
  const defaultClassNames = useDefaultClassNames();
  const [selected, setSelected] = useState<DateType>();

  return (
    <DateTimePicker
      timePicker={true}
      mode="single"
      date={date}
      onChange={({ date: newDate }) =>
        setDate(
          new Date(
            (newDate as Date)
          )
        )
      }
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
      containerHeight={250}
    // styles={{
    //   day: {
    //     flex: 'none',
    //     aspectRatio: 1,
    //   },
    //   day_cell: {
    //     flex: 'none',
    //     aspectRatio: 1,
    //   },

    // }}
    />
  );
}
