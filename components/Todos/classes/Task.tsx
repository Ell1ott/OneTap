import AppText from 'components/AppText';
import { Time } from '../types/Time';
import { JSX } from 'react';
import { TaskCategory } from './TaskCategory';
import { Todo } from './Todo';
import { Event } from './Event';

export class Task {
  id: string;
  title: string;
  emoji?: string;
  note?: string;
  repeat?: Time; // Also resets completion on todos
  tags?: string[];

  constructor(data: Partial<Task> & { id: string; title: string }) {
    this.id = data.id;
    this.title = data.title;
    this.emoji = data.emoji;
    this.note = data.note;
    this.repeat = data.repeat;
    this.tags = data.tags;
  }

  get subtext() {
    return this.note;
  }

  getSubtextClasses = () => '';
  renderSubtext = () => (
    <AppText
      className={`-mt-0.5 font-medium italic text-foregroundMuted ${this.getSubtextClasses()}`}>
      {this.subtext}
    </AppText>
  );

  renderEndContent = (
    updateTodo: (updates: Partial<Todo | Event | TaskCategory>) => void
  ): JSX.Element | null => null;

  isToday = () => false;
  isPriority = () => false;
}
