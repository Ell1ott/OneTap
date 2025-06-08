import { Tables } from 'utils/database.types';
import { isToday } from 'utils/dateUtils';

export const taskHandler = {
  todo: {
    isToday: (task: Tables<'todos'>) => {
      return isToday(new Date(task.end.date));
    },
  },
  event: {
    isToday: (task: Tables<'events'>) => {
      return isToday(new Date(task.start?.[0].date));
    },
  },
  calender: {
    isToday: ()
      return isToday(date.date);
    },
  },
};

