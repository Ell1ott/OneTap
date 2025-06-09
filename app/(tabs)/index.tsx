import { observable } from '@legendapp/state';
import { HomeScreen as HomeScreenComponent } from 'components/screens/HomeScreen/HomeScreen';
import { Event } from 'components/Todos/classes';
import { Todo } from 'components/Todos/classes/Todo';
import { events$, todos$ } from 'utils/supabase/SupaLegend';

export default function HomeScreen() {
  return <HomeScreenComponent />;
}
