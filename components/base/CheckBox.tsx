import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckBoxProps {
  checked?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  classname?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  checked = false,
  onToggle = () => {},
  disabled = false,
  size = 'md',
  classname = '',
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-[23px] h-[23px]',
    lg: 'w-6 h-6',
  };

  return (
    <TouchableOpacity
      className={`h-full flex-row items-center px-2 ${disabled ? 'opacity-50' : ''} ${classname}`}
      onPress={disabled ? undefined : onToggle}
      activeOpacity={0.7}>
      <View
        pointerEvents="none"
        className={`
          ${sizeClasses[size]}
          items-center
          justify-center
          rounded-full
          border-2
          ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-background'}
          ${disabled ? '' : 'active:scale-95'}
        `}>
        {checked && (
          <Check
            size={size === 'sm' ? 12 : size === 'md' ? 16 : 20}
            strokeWidth={2.5}
            className="text-white"
            color="white"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CheckBox;
