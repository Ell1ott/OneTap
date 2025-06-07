import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { HumanDate, PartialDate, Time } from 'components/Todos/types';

interface TasksStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task | Event | Todo | TaskCategory>) => void;
  removeTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string, index?: number) => void;
  loadTasks: () => Promise<void>;
}

// Local storage helper functions
const TASKS_STORAGE_KEY = 'tasks-store';

// Helper function to recursively add type information to HumanDate instances
const serializeWithTypes = (obj: any): any => {
  if (obj instanceof HumanDate) {
    return {
      ...obj,
      type: 'HumanDate',
    };
  }

  if (obj instanceof Time) {
    return {
      ...obj,
      type: 'Time',
    };
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeWithTypes);
  }

  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const serialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeWithTypes(value);
    }
    return serialized;
  }

  return obj;
};

// Helper function to recursively reconstruct typed objects
const deserializeWithTypes = (obj: any): any => {
  if (obj && typeof obj === 'object' && obj.type === 'HumanDate') {
    const { type, ...data } = obj;
    return new HumanDate(new Date(data.date), data.isTimeKnown);
  }

  if (obj && typeof obj === 'object' && obj.type === 'Time') {
    const { type, ...data } = obj;
    return new Time(data);
  }

  if (Array.isArray(obj)) {
    return obj.map(deserializeWithTypes);
  }

  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const deserialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      deserialized[key] = deserializeWithTypes(value);
    }
    return deserialized;
  }

  return obj;
};

const saveTasksToStorage = async (tasks: Task[]) => {
  console.log('saving tasks');
  try {
    // Add type property to each task and serialize nested HumanDate instances
    const tasksWithType = tasks.map((task) => {
      const serializedTask = serializeWithTypes({
        ...task,
        type: task.constructor.name,
      });
      return serializedTask;
    });
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksWithType));
  } catch (error) {
    console.error('Failed to save tasks to AsyncStorage:', error);
  }
};

const loadTasksFromStorage = async (): Promise<Task[] | null> => {
  try {
    const stored = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Convert plain objects back to class instances using the type property
    return parsed.map((taskData: any) => {
      // First deserialize nested HumanDate instances
      const deserializedData = deserializeWithTypes(taskData);

      switch (taskData.type) {
        case 'Todo':
          return new Todo(deserializedData);
        case 'Event':
          return new Event(deserializedData);
        case 'TaskCategory':
          return new TaskCategory(deserializedData);
        default:
          console.warn(`Unknown task type: ${taskData.type}`, taskData);
          return deserializedData;
      }
    });
  } catch (error) {
    console.error('Failed to load tasks from AsyncStorage:', error);
    return null;
  }
};

const createInitialTasks = (): Task[] => [
  new Todo({
    id: '1',
    title: 'Walk the dog',
    note: 'Twice every day',
    completed: [true, false],
    repeat: new Time({
      days: 1,
    }),
    amount: 2,
    end: new HumanDate(),
  }),
  new Event({
    id: '2',
    title: 'Volleyball practice',
    start: new HumanDate(new Date(new Date().setHours(17, 0, 0, 0)), true),
  }),
  new Todo({
    id: '4',
    title: 'Clean Room',
    doneTimes: [HumanDate.fromNaturalString('4 days ago')!],
    // note: 'Done 4 days ago',
    softRepeat: true,
    completed: [false],
  }),
  new Todo({
    id: '5',
    title: 'Catch up with Jake',
    note: 'Every 2 weeks',
    end: undefined,
    remindAt: undefined,
    repeat: undefined,
    softRepeat: new Time({
      weeks: 2,
    }),
    lastDone: new HumanDate(new Date(new Date().setDate(3))),
    emoji: '👋',
  }),
  new Todo({
    id: '6',
    title: 'Buy milk',
    note: 'Get the organic one',
    completed: [false],
    category: 'groceries',
    emoji: '🥛',
  }),
  new Todo({
    id: '7',
    title: 'Get fresh vegetables',
    note: 'Carrots, broccoli, spinach',
    completed: [false],
    category: 'groceries',
    emoji: '🥬',
  }),
  new TaskCategory({
    id: '2',
    title: 'Groceries',
    note: 'Recommended, 9 items',
  }),
  new TaskCategory({
    id: '3',
    title: 'Homework',
    note: '5 total, 3 urgent',
  }),
];

// Get initial tasks from AsyncStorage or fallback to default
const getInitialTasks = (): Task[] => {
  return createInitialTasks();
};

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: getInitialTasks(),

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (taskId, updates: Partial<Task | Event | Todo | TaskCategory>) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId) {
          Object.assign(task, updates);
        }
        return task;
      }),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  toggleTaskCompleted: (taskId, index = 0) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId && task instanceof Todo && task.completed) {
          const newCompleted = [...task.completed];
          newCompleted[index] = !newCompleted[index];
          task.completed = newCompleted;

          task.onToggle(newCompleted);
          return task;
        }
        return task;
      }),
    })),

  loadTasks: async () => {
    const storedTasks = await loadTasksFromStorage();
    if (storedTasks) {
      set({ tasks: storedTasks });
    }
  },
}));

// Subscribe to store changes and automatically save to AsyncStorage
useTasksStore.subscribe((state) => {
  saveTasksToStorage(state.tasks);
});
