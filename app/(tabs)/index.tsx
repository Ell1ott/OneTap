import { observable } from '@legendapp/state';
import { HomeScreen as HomeScreenComponent } from 'components/screens/HomeScreen/HomeScreen';
import { Event } from 'components/Todos/classes';
import { Todo } from 'components/Todos/classes/Todo';
import { events$, todos$ } from 'utils/supabase/SupaLegend';

export const tasks$ = observable(() => {
  const todos = todos$.get();
  const events = events$.get();
  return [
    ...Object.values(todos).map((t) => new Todo(t)),
    ...Object.values(events).map((e) => new Event(e)),
  ] as (Todo | Event)[];
});
export default function HomeScreen() {
  return <HomeScreenComponent tasks$={tasks$} />;
}
