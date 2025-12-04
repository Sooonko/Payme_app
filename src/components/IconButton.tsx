import { LucideIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface IconButtonProps {
    icon: LucideIcon;
    label: string;
    onPress?: () => void;
    color?: string;
}

export const IconButton = ({ icon: Icon, label, onPress, color = 'white' }: IconButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} className="items-center gap-2">
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-md">
                <Icon size={24} color={color} />
            </View>
            <Text className="text-white text-xs font-medium">{label}</Text>
        </TouchableOpacity>
    );
};
