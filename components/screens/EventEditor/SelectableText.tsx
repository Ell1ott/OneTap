import AppText from 'components/base/AppText';
import { Pressable } from 'react-native';

export const SelectableText = ({
    children,
    onPress = () => { },
    isSelected = false,
    pressable = true,
}: {
    children: React.ReactNode;
    onPress?: () => void;
    isSelected?: boolean;
    pressable?: boolean;
}) => (
    <Pressable
        disabled={!pressable}
        onPress={onPress}
        className={`h-[2rem] flex-1 items-center justify-center rounded-full px-4 ${isSelected && pressable ? 'bg-card' : 'bg-transparent'
            }`}>
        <AppText
            className={`text-center font-medium ${isSelected ? 'text-foreground' : 'text-foregroundMuted'
                }`}>
            {children}
        </AppText>
    </Pressable>
);
