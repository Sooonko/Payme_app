import { LucideIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface PocketCardProps {
    icon: LucideIcon;
    title: string;
    target: string;
    current: string;
    progress: number;
    onPress?: () => void;
}

export const PocketCard = ({
    icon: Icon,
    title,
    target,
    current,
    progress,
    onPress
}: PocketCardProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-card rounded-2xl p-3 w-32 mr-3"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            {/* Header: Title on left, Icon and Lock on right */}
            <View className="flex-row items-start justify-between mb-3">
                <Text className="text-white text-sm font-bold">{title}</Text>
                <View className="flex-row items-center gap-1.5">
                    <View className="w-6 h-6 rounded-full bg-white/5 items-center justify-center">
                        <Text className="text-white text-xs">🔒</Text>
                    </View>
                    <View className="w-8 h-8 rounded-xl bg-primary/20 items-center justify-center">
                        <Icon size={18} color="#7F3DFF" />
                    </View>
                </View>
            </View>

            {/* Target and Progress Info */}
            <View className="mb-2">
                <Text className="text-text-muted text-xs mb-1">Your Target</Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-white text-sm font-bold">${target}</Text>
                    <Text className="text-text-muted text-xs">{progress}%</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View>
                <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <View
                        className="h-full rounded-full"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: '#7F3DFF',
                        }}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

