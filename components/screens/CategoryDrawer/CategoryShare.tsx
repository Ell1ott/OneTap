import AppText from 'components/base/AppText';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { categories$, supabase } from 'utils/supabase/SupaLegend';
import { toast } from 'sonner-native';

const CategoryShare = ({ id }: { id: string }) => {
  useEffect(() => {
    const addPermission = async () => {
      const { data, error } = await supabase
        .from('permissions')
        .insert({
          category: id,
        })
        .select()
        .single();
      if (error) {
        console.error(error);
      }

      const newCategoryId = data?.category;

      if (!newCategoryId) {
        toast.error('Failed to add you to the category');
        return;
      }

      const { data: newCategory, error: newCategoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', newCategoryId)
        .single();

      if (newCategoryError) {
        toast.error('Failed to add you to the category');
        return;
      }

      categories$[id].set(newCategory);
    };
    addPermission();
  }, []);

  return (
    <View className="h-[30%] items-center justify-center px-8">
      {/* Loading Animation Container */}

      {/* Icon and Spinner */}

      <View className="mb-2">
        <ActivityIndicator size={40} color="#007AFF" />
      </View>

      {/* Main Text */}
      <AppText className="mb-2 text-center text-xl font-semibold text-foreground">
        Joining Category
      </AppText>

      {/* Subtitle */}
      <AppText className="text-center text-base leading-6 text-foregroundMuted">
        Adding you to the shared category...{'\n'}
      </AppText>
    </View>
  );
};

export default CategoryShare;
