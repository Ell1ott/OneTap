import { Task } from './Task';
import { PartialDate } from '../types/PartialDate';
import { Time } from '../types/Time';
import { View } from 'react-native';
import CheckBox from 'components/base/CheckBox';

export class Todo extends Task {
  start?: PartialDate;
  due?: PartialDate;
  remindAt?: PartialDate;
  lastDone?: PartialDate;
  doneTimes?: PartialDate[];
  softRepeat?: Time | true; // First repeats when finished
  completed?: boolean[];
  amount?: number;
  category?: string;

  constructor(data: Partial<Todo> & { id: string; title: string }) {
    super(data);
    Object.assign(this, data);
    if (this.doneTimes) {
      this.lastDone = this.doneTimes?.[this.doneTimes.length - 1];
    } else if (this.lastDone) {
      this.doneTimes = [this.lastDone];
    }
    this.completed = data.completed || [false];
  }

  isToday = () => this.due?.isToday() || false;
  isPriority = () =>
    !!(
      this.softRepeat instanceof Time &&
      this.lastDone &&
      this.softRepeat.toDays() - this.daysSinceLastDone < 2
    );

  get daysSinceLastDone() {
    return this.lastDone?.timeTo(new PartialDate(new Date())).toDays() ?? 0;
  }

  // Tailwind classes used dynamically: bg-red-500
  getSubtextClasses = () => {
    if (!(this.softRepeat instanceof Time) || !this.lastDone) return '';
    const days = this.softRepeat.toDays() - this.daysSinceLastDone;
    if (days < -4) return 'text-red-500';
    if (days < 4) return 'text-[#FF6A00]/70';

    return '';
  };
  get subtext() {
    if (this.softRepeat && this.lastDone) {
      const rounded = Math.round(this.daysSinceLastDone);
      if (rounded === 0) return 'Done today';
      if (rounded === 1) return 'Done yesterday';
      return `Done ${rounded} days ago`;
    }
    return this.note;
  }

  onToggle = (newCompleted: boolean[]) => {
    if (newCompleted.every(Boolean)) {
      this.doneTimes = [...(this.doneTimes || []), new PartialDate(new Date())];
      console.log(this.doneTimes);
    } else {
      this.doneTimes = this.doneTimes?.filter((doneTime) => !doneTime.isToday());
    }

    this.lastDone = this.doneTimes?.[this.doneTimes.length - 1];
  };

  renderEndContent = (updateTodo: (updates: Partial<Todo>) => void) => (
    <View className="flex-row items-center">
      {this.completed?.map((completed, index) => (
        <CheckBox
          key={index}
          checked={completed}
          classname={` ${index === 0 ? 'pl-24 -ml-24' : ''} ${
            index === (this.completed?.length || 0) - 1 ? 'pr-6 -mr-6' : ''
          }`}
          onToggle={() => {
            const newCompleted = [...(this.completed || [])];
            newCompleted[index] = !newCompleted[index];
            updateTodo({ completed: newCompleted });

            this.onToggle(newCompleted);
          }}
        />
      ))}
    </View>
  );
}
