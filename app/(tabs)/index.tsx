import { observable } from '@legendapp/state';
import AppText from 'components/base/AppText';
import { HomeScreen as HomeScreenComponent } from 'components/screens/HomeScreen/HomeScreen';
import { Event, TaskCategory } from 'components/Todos/classes';
import { Todo } from 'components/Todos/classes/Todo';
import { categories$, events$, todos$ } from 'utils/supabase/SupaLegend';

export default function HomeScreen() {
  return <HomeScreenComponent />;
}
