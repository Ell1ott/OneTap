import { createClient } from '@supabase/supabase-js';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Database, TablesInsert } from './database.types';

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signInAnonymously() {
  if (supabase.auth.getSession() === null) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      throw error;
    }
    return data;
  }
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

export function addTodo(todo: TablesInsert<'todos'>) {
  const id = generateId();
  // Add keyed by id to the todos$ observable to trigger a create in Supabase
  todos$[id].assign({
    ...todo,
    id,
  });
}

export function addEvent(event: TablesInsert<'events'>) {
  const id = generateId();
  events$[id].assign({
    ...event,
    id,
  });
}

export function addCategory(category: TablesInsert<'categories'>) {
  const id = generateId();
  categories$[id].assign({
    ...category,
    id,
  });
}
