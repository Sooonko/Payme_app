import { router } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SendMoneyScreen() {
    const [amount, setAmount] = useState('2,545');

    const handleNumberPress = (num: string) => {
        if (num === '00') {
            setAmount(prev => prev + '00');
        } else if (num === '⌫') {
            setAmount(prev => prev.slice(0, -1));
        } else {
            setAmount(prev => prev + num);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1">
                {/* Header */}
                <View className="px-5 pt-4 pb-6 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-card items-center justify-center"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Send Money</Text>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-card items-center justify-center">
                        <Text className="text-white text-lg">⋮</Text>
                    </TouchableOpacity>
                </View>

                {/* Recipient */}
                <View className="px-5 mb-6">
                    <View className="bg-card rounded-3xl p-4 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3 flex-1">
                            <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                                <Text className="text-white text-lg">👤</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-semibold text-base">Maguire</Text>
                                <Text className="text-text-muted text-sm">0878 1234 5678 • Copy</Text>
                            </View>
                        </View>
                        <ArrowRight size={20} color="#8F92A1" />
                    </View>
                </View>

                {/* Note */}
                <View className="px-5 mb-6">
                    <View className="bg-card rounded-3xl p-4 flex-row items-center justify-between">
                        <Text className="text-text-muted text-base">Write a note</Text>
                        <Text className="text-white text-lg">✏️</Text>
                    </View>
                </View>

                {/* Amount */}
                <View className="px-5 mb-8">
                    <Text className="text-text-muted text-sm mb-2">Enter Amount</Text>
                    <Text className="text-white text-5xl font-bold">${amount}</Text>
                </View>

                <View className="flex-1" />

                {/* Numpad */}
                <View className="px-5 pb-6">
                    <View className="gap-4">
                        <View className="flex-row justify-between">
                            <NumButton value="1" onPress={handleNumberPress} />
                            <NumButton value="2" onPress={handleNumberPress} />
                            <NumButton value="3" onPress={handleNumberPress} />
                        </View>
                        <View className="flex-row justify-between">
                            <NumButton value="4" onPress={handleNumberPress} />
                            <NumButton value="5" onPress={handleNumberPress} />
                            <NumButton value="6" onPress={handleNumberPress} />
                        </View>
                        <View className="flex-row justify-between">
                            <NumButton value="7" onPress={handleNumberPress} />
                            <NumButton value="8" onPress={handleNumberPress} />
                            <NumButton value="9" onPress={handleNumberPress} />
                        </View>
                        <View className="flex-row justify-between">
                            <NumButton value="00" onPress={handleNumberPress} />
                            <NumButton value="0" onPress={handleNumberPress} />
                            <NumButton value="⌫" onPress={handleNumberPress} />
                        </View>
                    </View>

                    {/* Transfer Button */}
                    <TouchableOpacity className="bg-primary rounded-2xl py-4 mt-6 flex-row items-center justify-center gap-2">
                        <ArrowRight size={20} color="white" />
                        <Text className="text-white text-lg font-bold">Swipe to Transfer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

function NumButton({ value, onPress }: { value: string; onPress: (val: string) => void }) {
    return (
        <TouchableOpacity
            onPress={() => onPress(value)}
            className="w-20 h-20 rounded-2xl bg-card items-center justify-center active:bg-primary/20"
        >
            <Text className="text-white text-2xl font-semibold">{value}</Text>
        </TouchableOpacity>
    );
}
