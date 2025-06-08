import AppText from 'components/base/AppText';
import { Time } from '../types/Time';
import { JSX } from 'react';
import { TaskCategory } from './TaskCategory';
import { Todo } from './Todo';
import { Event } from './Event';
import { Tables } from 'utils/database.types';

export class Task {
  r: Tables<'todos'> | Tables<'events'>;

  constructor(data: Tables<'todos'> | Tables<'events'>) {
    this.r = data;
  }

  get subtext() {
    return this.r.note;
  }

  getSubtextClasses = () => '';
  renderSubtext = () =>
    this.subtext && (
      <AppText
        className={`-mt-0.5 font-medium italic text-foregroundMuted ${this.getSubtextClasses()}`}>
        {this.subtext}
      </AppText>
    );

  EndContent = ({
    updateTodo,
  }: {
    updateTodo: (updates: Partial<Todo | Event | TaskCategory>) => void;
  }): JSX.Element | null => null;

  isToday = () => false;
  isPriority = () => false;
}
