import AppText from 'components/base/AppText';
import { observer } from '@legendapp/state/react';
import { Pressable, ScrollView, View } from 'react-native';
import { categories$, tasks$, todos$ } from 'utils/supabase/SupaLegend';
import { TaskCategory } from 'components/Todos/classes';
import { Tables } from 'utils/supabase/database.types';
import { router } from 'expo-router';

export const CategorySection = observer(() => {
  const categoriesDict = categories$.get(true);
  if (categoriesDict === undefined || categoriesDict === null) {
    return null;
  }
  const categories = Object.values(categoriesDict);
  console.log('rerendering category section');
  const Wrapper = categories.length > 2 ? ScrollView : View;
  return (
    <Wrapper
      className={'-mx-4 mb-6 flex-none flex-row gap-2' + (categories.length <= 2 ? ' px-4' : '')}
      contentContainerClassName="gap-2 px-4"
      showsHorizontalScrollIndicator={false}
      horizontal={categories.length > 2}>
      {categories.map((category: Tables<'categories'>, index: number) => (
        <CategoryCard
          scrollable={categories.length > 2}
          key={category.id}
          id={category.id}
          index={index}
        />
      ))}
    </Wrapper>
  );
});

export const CategoryCard = observer(
  ({ id, index, scrollable }: { id: string; index: number; scrollable: boolean }) => {
    const category = categories$[id].get();
    const todos = Object.values(todos$.get());
    const categoryTodos = todos.filter((todo) => todo.category === category.id);
    const undoneTodos = categoryTodos.filter((todo) => todo.completed?.includes(false));

    const colors = [
      'bg-blue-100 dark:bg-blue-900/10',
      'bg-[#D5F5E8]',
      'bg-red-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100',
      'bg-orange-100',
      'bg-gray-100',
    ];
    const randomColor = colors[index % colors.length];
    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/category',
            params: {
              id: category.id,
            },
          });
        }}
        key={category.id}
        className={`flex-row gap-1 rounded-xl ${randomColor} p-4 ${scrollable ? 'w-[9rem]' : 'flex-1'}`}>
        <AppText className="text-lg font-medium text-foreground">{undoneTodos.length}</AppText>
        <AppText numberOfLines={1} className="text-lg font-medium text-foreground/50">
          {category.title}
        </AppText>
      </Pressable>
    );
  }
);
