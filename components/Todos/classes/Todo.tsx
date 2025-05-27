import { Task } from './Task';
import { PartialDate } from '../types/PartialDate';
import { Time } from '../types/Time';
import { View } from 'react-native';
import CheckBox from 'components/CheckBox';

export class Todo extends Task {
  start?: PartialDate;
  due?: PartialDate;
  remindAt?: PartialDate;
  lastDone?: PartialDate;
  softRepeat?: Time; // First repeats when finished
  completed?: boolean[];
  amount?: number;
  category?: string;

  constructor(data: Partial<Todo> & { id: string; title: string; note: string }) {
    super(data);
    this.note = data.note;
    this.start = data.start;
    this.due = data.due;
    this.remindAt = data.remindAt;
    this.lastDone = data.lastDone;
    this.softRepeat = data.softRepeat;
    this.completed = data.completed;
    this.amount = data.amount;
    this.category = data.category;
  }

  isToday = () => this.due?.isToday() || false;
  isPriority = () =>
    !!(this.softRepeat && this.lastDone && this.softRepeat.toDays() - this.daysSinceLastDone < 2);

  get daysSinceLastDone() {
    return this.lastDone?.timeTo(new PartialDate(new Date())).toDays() ?? 0;
  }

  // Tailwind classes used dynamically: bg-red-500
  getSubtextClasses = () => {
    if (!this.softRepeat || !this.lastDone) return '';
    const days = this.softRepeat.toDays() - this.daysSinceLastDone;
    if (days < -4) return 'text-red-500';
    if (days < 4) return 'text-[#FF6A00]/70';

    return '';
  };
  get subtext() {
    if (this.softRepeat && this.lastDone) {
      const days = this.softRepeat.toDays() - this.daysSinceLastDone;
      if (days < 4) {
        const rounded = Math.round(this.daysSinceLastDone);
        return `Done ${rounded} days ago`;
      }
    }
    return this.note;
  }

  onFinish = () => {
    console.log('onFinish');
  };

  renderEndContent = (updateTodo: (updates: Partial<Todo>) => void) => (
    <View className="flex-row items-center">
      {this.completed?.map((completed, index) => (
        <CheckBox
          key={index}
          checked={completed}
          classname={` ${index === 0 ? 'pl-6 -ml-6' : ''} ${
            index === (this.completed?.length || 0) - 1 ? 'pr-6 -mr-6' : ''
          }`}
          onToggle={() => {
            console.log('onToggle', index);
            const newCompleted = [...(this.completed || [])];
            newCompleted[index] = !newCompleted[index];
            updateTodo({ completed: newCompleted });

            if (newCompleted.every(Boolean)) {
              this.onFinish();
            }
          }}
        />
      ))}
    </View>
  );
}
