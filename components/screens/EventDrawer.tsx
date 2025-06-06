import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { useTasksStore } from 'stores/tasksStore';
import DatePicker from 'react-native-date-picker';
import {
  Calendar,
  toDateId,
  useCalendar,
  UseCalendarParams,
} from '@marceloterreiro/flash-calendar';
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
              className="text-3xl font-bold outline-none placeholder:text-foreground/40"
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
            />
          </View>
          <BasicCalendar params={{ calendarMonthId: today, calendarFirstDayOfWeek: 'monday' }} />
        </View>
      </ScrollView>
    </Drawer>
  );
}

const today = toDateId(new Date());

export function BasicCalendar({ params }: { params: UseCalendarParams }) {
  const [selectedDate, setSelectedDate] = useState(today);
  const { calendarRowMonth, weekDaysList, weeksList } = useCalendar(params);
  return (
    <View>
      <AppText>Selected date: {selectedDate}</AppText>
      <View>
        <Calendar.VStack spacing={4}>
          {/* Replaces `Calendar.Row.Month` with a custom implementation */}
          <Calendar.HStack alignItems="center" justifyContent="space-around" width="100%">
            <AppText className="text-2xl">{calendarRowMonth}</AppText>
          </Calendar.HStack>

          <Calendar.Row.Week spacing={4}>
            {weekDaysList.map((day, i) => (
              <Calendar.Item.WeekName height={32} key={i}>
                {day}
              </Calendar.Item.WeekName>
            ))}
            <View />
          </Calendar.Row.Week>

          {weeksList.map((week, i) => (
            <Calendar.Row.Week key={i}>
              {week.map((day) => (
                <Calendar.Item.Day.Container
                  dayHeight={32}
                  daySpacing={4}
                  isStartOfWeek={day.isStartOfWeek}
                  key={day.id}>
                  <Calendar.Item.Day height={32} metadata={day} onPress={setSelectedDate}>
                    {day.displayLabel}
                  </Calendar.Item.Day>
                </Calendar.Item.Day.Container>
              ))}
            </Calendar.Row.Week>
          ))}

          <View>
            <View />
            <AppText>Today: {new Date().toLocaleDateString()}</AppText>
          </View>
        </Calendar.VStack>
      </View>
    </View>
  );
}
