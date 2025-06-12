import AppText from 'components/base/AppText';
import { View } from 'react-native';
import { SelectableText } from './SelectableText';
import { TabType } from './EventDrawer';

export const TypeSelector = ({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (activeTab: TabType) => void }) => {
    return (
        <View className="flex-row rounded-full bg-background p-1.5">
            <SelectableText
                onPress={() => setActiveTab('Event')}
                isSelected={activeTab === 'Event'}>
                Event
            </SelectableText>
            <SelectableText onPress={() => setActiveTab('Todo')} isSelected={activeTab === 'Todo'}>
                <AppText
                    className={`text-center font-medium ${activeTab === 'Todo' ? 'text-foreground' : 'text-foregroundMuted'
                        }`}>
                    Todo
                </AppText>
            </SelectableText>
        </View>

    )
}