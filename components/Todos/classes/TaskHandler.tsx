import { Tables } from 'utils/supabase/database.types';
import { isToday } from 'utils/dateUtils';

export const taskHandler = {
  todo: {
    isToday: (task: Tables<'todos'>) => {
      const date = task.end?.date;
      if (typeof date !== 'string' && typeof date !== 'number') return false;
      return isToday(new Date(date));
    },
  },
  event: {
    isToday: (task: Tables<'events'>) => {
      const date = task.start?.[0]?.date;
      if (typeof date !== 'string' && typeof date !== 'number') return false;
      return isToday(new Date(date));
    },
  },
  calendar: {
    isToday: (date: Date) => {
      return isToday(date);
    },
  },
};
