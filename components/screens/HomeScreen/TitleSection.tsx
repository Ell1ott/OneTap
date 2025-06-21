import { View } from 'react-native';
import AppText from '../../base/AppText';

export const TitleSection = () => {
  // getting todays date in the format of "26 dec"
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'short' });
  const dateString = `${day} ${month}`;

  return (
    <View className="flex-row gap-2">
      <AppText f className="mb-1 text-[2rem] font-extrabold text-foreground">
        Overview
      </AppText>
      <AppText f className="text-[2rem] font-extrabold text-foreground/50">
        {dateString}
      </AppText>
    </View>
  );
};
