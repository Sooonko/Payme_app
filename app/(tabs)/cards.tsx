import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CardsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-5">
                <View className="pt-4 pb-6">
                    <Text className="text-white text-2xl font-bold">My Cards</Text>
                </View>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-text-muted text-lg">Cards Screen</Text>
                    <Text className="text-text-muted text-sm mt-2">Coming soon...</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
