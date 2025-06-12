import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, Pressable, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, CalendarPlus } from 'lucide-react-native';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';
import { Icon } from 'components/base/LucideIcon';
import { TextInput } from 'react-native-gesture-handler';
import { observer } from '@legendapp/state/react';
import { events$ } from 'utils/supabase/SupaLegend';
import { SelectableText } from './SelectableText';
import { DateTime } from './DateTimeInput';

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
export const EventDrawer = observer(({ onClose, id }: { onClose: () => void; id: string }) => {
  const event$ = events$[id];
  const [title, setTitle] = useState(event$.title);
  const [date, setDate] = useState();
  const [activeTab, setActiveTab] = useState<TabType>('Event');

  const startDate = new Date(event$.start[0].date.get() as string);
  const endDateString = event$.end[0].date.get() as string | undefined;
  const endDate = endDateString ? new Date(endDateString) : undefined;

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
          startDate={startDate}
          endDate={endDate}
          setStartDate={(date) => {
            console.log('ddd', date);
            event$.start[0].date.set(new Date(date).toISOString());
          }}
          setEndDate={(date) => {
            event$.end[0].date.set(new Date(date).toISOString());
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