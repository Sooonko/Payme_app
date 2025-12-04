import { LucideIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface TransactionItemProps {
    icon: LucideIcon;
    iconBg: string;
    title: string;
    date: string;
    amount: string;
    isPositive?: boolean;
    onPress?: () => void;
}

export const TransactionItem = ({
    icon: Icon,
    iconBg,
    title,
    date,
    amount,
    isPositive = false,
    onPress
}: TransactionItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between py-4 px-5"
            style={{ backgroundColor: iconBg }}
            activeOpacity={0.8}
        >
            <View className="flex-row items-center gap-3 flex-1">
                <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
                    <Icon size={24} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-semibold text-base mb-0.5">{title}</Text>
                    <Text className="text-white/70 text-xs">{date}</Text>
                </View>
            </View>
            <Text className="font-bold text-lg text-white">
                {isPositive ? '+' : '-'}${amount}
            </Text>
        </TouchableOpacity>
    );
};
