import Drawer from 'components/base/Drawer';
import { View } from 'react-native';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { observer } from '@legendapp/state/react';
import { events$ } from 'utils/supabase/SupaLegend';
import { DateTime } from './DateTimeInput';
import { TypeSelector } from './TypeInput';

export type TabType = 'Event' | 'Todo';

export const EventDrawer = observer(({ onClose, id }: { onClose: () => void; id: string }) => {
  const event$ = events$[id];
  // const [date, setDate] = useState();
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
        <TypeSelector
          activeTab={activeTab}
          setActiveTab={(a: TabType) => {
            setActiveTab(a);
          }}></TypeSelector>
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
