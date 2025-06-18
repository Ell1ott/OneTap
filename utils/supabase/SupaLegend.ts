import { createClient } from '@supabase/supabase-js';
import { observable } from '@legendapp/state';
import { configureSynced } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Database, Tables, TablesInsert } from './database.types';
import { Event, TaskCategory, Todo } from 'components/Todos/classes';
import { Platform } from 'react-native';
import { router } from 'expo-router';

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export async function signInAnonymously() {
  if ((await supabase.auth.getSession()).data.session === null) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      throw error;
    }

    setTimeout(() => {
      console.log('adding initial tasks');
      addDeafultTasks();
    }, 1000);

    return data;
  } else {
    console.log('fej', await supabase.auth.getSession());
  }
}

export async function addDeafultTasks() {
  const date = new Date(+new Date() + 1000).toISOString();
  addTodo({
    title: 'Walk the dog',
    note: 'Twice every day',
    completed: [true, false],
    updated_at: date,
  });
  addEvent({
    title: 'Volleyball practice',
    start: [
      {
        date: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
        isTimeKnown: true,
      },
    ],
    updated_at: date,
  });
  addCategory({
    title: 'Groceries',
    updated_at: date,
  });
  addCategory({
    title: 'Homework',
    updated_at: date,
  });
  addTodo({
    title: 'Clean Room',
    note: 'Done 4 days ago',
    completed: [false],
    soft_repeat: { days: 7 },
    updated_at: date,
  });
  // addTodo({
  //   title: 'Milk',
  //   completed: [false],
  //   category: 'Groceries',
  //   updated_at: date,
  // });
  // addTodo({
  //   title: 'Bread',
  //   completed: [false],
  //   category: 'Groceries',
  //   updated_at: date,
  // });
}

export const generateId = () => uuidv4();

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
  // Use React Native Async Storage
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  // Optionally enable soft deletes
  fieldDeleted: 'deleted',
});

export const todos$ = observable(
  customSynced({
    supabase,
    collection: 'todos',
    select: (from) => from.select('*'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    // Persist data and pending changes locally
    persist: {
      name: 'todos',
      retrySync: true, // Persist pending changes and retry
    },
    retry: {
      infinite: true, // Retry changes with exponential backoff
    },
  })
);
export const events$ = observable(
  customSynced({
    supabase,
    collection: 'events',
    select: (from) => from.select('*'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    // Persist data and pending changes locally
    persist: {
      name: 'events',
      retrySync: true, // Persist pending changes and retry
    },
    retry: {
      infinite: true, // Retry changes with exponential backoff
    },
  })
);
export const categories$ = observable(
  customSynced({
    supabase,
    collection: 'categories',
    select: (from) => from.select('*'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    // Persist data and pending changes locally
    persist: {
      name: 'categories',
      retrySync: true, // Persist pending changes and retry
    },
    retry: {
      infinite: true, // Retry changes with exponential backoff
    },
  })
);

export const user$ = observable<Tables<'users'> | null>(null);

supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('sb auth change', event, session);
  if (event === 'INITIAL_SESSION' && !session) {
    console.log('pushing to auth');
    // router.push('/auth'); TODO
  }
  setTimeout(async () => {
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      if (error) {
        console.error(error);
      }
      console.log('user', data);
      if (data) user$.set(data);
    }
  }, 10);
});

export function addTodo(todo: TablesInsert<'todos'>) {
  const id = generateId();
  // Add keyed by id to the todos$ observable to trigger a create in Supabase
  todos$[id].assign({
    ...todo,
    id,
  });
  return id;
}

export function addEvent(event: TablesInsert<'events'>) {
  const id = generateId();
  events$[id].assign({
    ...event,
    id,
  });
  return id;
}

export function addCategory(category: TablesInsert<'categories'>) {
  const id = generateId();
  categories$[id].assign({
    ...category,
    id,
  });
  return id;
}

export const tasks$ = observable(() => {
  const todos = todos$.get();
  const events = events$.get();
  const categories = categories$.get();
  if (!todos || !events || !categories) return [];
  return [
    ...Object.values(todos).map((t) => new Todo(t)),
    ...Object.values(events).map((e) => new Event(e)),
    ...Object.values(categories).map((c) => new TaskCategory(c)),
  ];
});
