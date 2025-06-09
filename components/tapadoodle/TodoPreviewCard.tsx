import { View } from 'react-native';
import AppText from 'components/base/AppText';
import { Calendar, Clock, Repeat, AlertCircle } from 'lucide-react-native';
import { Todo } from 'components/Todos/classes';
import { HumanDate } from 'components/Todos/types';

export interface TodoAIData {
  title: string;
  type: 'todo' | 'event';
  emoji?: string;
  note?: string;
  start?: string | string[] | null;
  end?: string | string[] | null;
  due?: string | string[] | null;
  softDue?: string | null;
  remindAt?: string | string[] | null;
  repeat?: { days?: number; weeks?: number; months?: number } | null;
  repeatSoftly?: boolean | null;
  amount?: number | null;
  category?: string | null;
}

interface TodoPreviewCardProps {
  todo: TodoAIData;
}

const formatDate = (dateString: string | string[] | null) => {
  if (!dateString) return null;
  if (Array.isArray(dateString)) {
    return dateString.map((date) => HumanDate.fromNaturalString(date)?.toLocaleString()).join(', ');
  }
  const date = HumanDate.fromNaturalString(dateString);
  if (!date) return null;
  return date.toLocaleString();
};

export const TodoPreviewCard = ({ todo }: TodoPreviewCardProps) => {
  const { title, type, emoji, note, start, end, due, softDue, remindAt, repeat, amount, category } =
    todo;

  const getRepeatText = () => {
    if (!repeat) return null;
    if (repeat.days) return `Every ${repeat.days} day${repeat.days > 1 ? 's' : ''}`;
    if (repeat.weeks) return `Every ${repeat.weeks} week${repeat.weeks > 1 ? 's' : ''}`;
    if (repeat.months) return `Every ${repeat.months} month${repeat.months > 1 ? 's' : ''}`;
    return null;
  };

  // const typeColor =
  //   type === 'event' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-accent/20 border-accent/30';
  const typeIcon = type === 'event' ? 'bg-yellow-300/90' : 'bg-accent/30';

  return (
    <View className={`mt-3 rounded-lg bg-background/70 p-3`}>
      {/* Header */}
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {emoji && <AppText className="text-lg">{emoji}</AppText>}
          <AppText className="text-base font-semibold text-foreground">{title}</AppText>
          {amount && amount > 1 && (
            <View className="rounded-full bg-foregroundMuted/20 px-2 py-0.5">
              <AppText className="text-xs font-medium">{amount}x</AppText>
            </View>
          )}
        </View>
        <View className={`rounded-full px-2 py-1 ${typeIcon}`}>
          <AppText className="text-xs font-medium capitalize">{type}</AppText>
        </View>
      </View>

      <View className="gap-2">
        {/* Note */}
        {note && <AppText className="mb-2 text-sm italic text-foregroundMuted">{note}</AppText>}
        {/* Category */}
        {category && (
          <View className="self-start rounded-md bg-accent/20 px-2 py-1">
            <AppText className="text-xs font-medium capitalize text-accent">{category}</AppText>
          </View>
        )}
        {/* Details */}
        {(start || end || due || softDue || remindAt || repeat) && (
          <View className="gap-1">
            {start && (
              <View className="flex-row items-center gap-2">
                <Clock size={14} color="#666" />
                <AppText className="text-sm text-foregroundMuted">
                  Starts: {formatDate(start)}
                </AppText>
              </View>
            )}
            {end && (
              <View className="flex-row items-center gap-2">
                <Calendar size={14} color="#666" />
                <AppText className="text-sm text-foregroundMuted">Ends: {formatDate(end)}</AppText>
              </View>
            )}
            {due && (
              <View className="flex-row items-center gap-2">
                <AlertCircle size={14} color="#ef4444" />
                <AppText className="text-sm text-red-500">Due: {formatDate(due)}</AppText>
              </View>
            )}
            {softDue && (
              <View className="flex-row items-center gap-2">
                <AlertCircle size={14} color="#f59e0b" />
                <AppText className="text-sm text-amber-500">Target: {formatDate(softDue)}</AppText>
              </View>
            )}
            {remindAt && (
              <View className="flex-row items-center gap-2">
                <Clock size={14} color="#8b5cf6" />
                <AppText className="text-sm text-purple-500">
                  Remind: {formatDate(remindAt)}
                </AppText>
              </View>
            )}
            {repeat && (
              <View className="flex-row items-center gap-2">
                <Repeat size={14} color="#06b6d4" />
                <AppText className="text-sm text-cyan-500">{getRepeatText()}</AppText>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
