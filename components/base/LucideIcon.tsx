import { iconWithClassName } from './iconWithClassName';
import { LucideIcon, LucideProps } from 'lucide-react-native';
import { Platform, View } from 'react-native';

type IconProps = LucideProps & {
  icon: LucideIcon;
};

export const Icon = ({ icon: LucideIcon, className, ...props }: IconProps) => {
  iconWithClassName(LucideIcon);

  const iconClassName = Platform.select({
    native: className,
  });

  const viewClassName = Platform.select({
    web: '[&>svg]:size-full ' + className,
  });

  return (
    <View className={viewClassName}>
      <LucideIcon className={iconClassName} {...props} />
    </View>
  );
};
