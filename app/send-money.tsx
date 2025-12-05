import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchUsers, UserSearchResponse } from '../src/api/client';

export default function SendMoneyScreen() {
    const [amount, setAmount] = useState('2,545');
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResponse['data']>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSearchResponse['data'][0] | null>(null);

    const handleSearch = async (text: string) => {
        setSearchQuery(text);
        if (text.length > 2) {
            setLoading(true);
            try {
                const response = await searchUsers(text);
                if (response.success) {
                    setSearchResults(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectUser = (user: UserSearchResponse['data'][0]) => {
        setSelectedUser(user);
        setIsSearchModalVisible(false);
        setSearchQuery('');
        setSearchResults([]);
    };

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
                {/* Recipient */}
                <View className="px-5 mb-6">
                    <TouchableOpacity
                        onPress={() => setIsSearchModalVisible(true)}
                        className="bg-card rounded-3xl p-4 flex-row items-center justify-between"
                    >
                        {selectedUser ? (
                            <View className="flex-row items-center gap-3 flex-1">
                                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                                    <Text className="text-white text-lg">{selectedUser.name.charAt(0)}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-semibold text-base">{selectedUser.name}</Text>
                                    <Text className="text-text-muted text-sm">{selectedUser.phone}</Text>
                                </View>
                            </View>
                        ) : (
                            <View className="flex-row items-center gap-3 flex-1">
                                <View className="w-12 h-12 rounded-full bg-card-light items-center justify-center border border-dashed border-text-muted">
                                    <Text className="text-text-muted text-lg">+</Text>
                                </View>
                                <Text className="text-text-muted font-semibold text-base">Select Recipient</Text>
                            </View>
                        )}
                        <ArrowRight size={20} color="#8F92A1" />
                    </TouchableOpacity>
                </View>

                {/* Search Modal */}
                <Modal
                    visible={isSearchModalVisible}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <View className="flex-1 bg-background">
                        <View className="px-5 pt-4 pb-4 flex-row items-center gap-3">
                            <View className="flex-1 flex-row items-center bg-card rounded-xl px-3 h-12">
                                <Search size={20} color="#8F92A1" />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-base"
                                    placeholder="Search by name or phone"
                                    placeholderTextColor="#8F92A1"
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                    autoFocus
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => handleSearch('')}>
                                        <X size={20} color="#8F92A1" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => setIsSearchModalVisible(false)}>
                                <Text className="text-primary font-semibold text-base">Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator color="#A78BFA" />
                            </View>
                        ) : (
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.userId}
                                contentContainerStyle={{ padding: 20 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelectUser(item)}
                                        className="flex-row items-center gap-3 mb-4 bg-card p-4 rounded-2xl"
                                    >
                                        <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                                            <Text className="text-primary text-lg font-bold">{item.name.charAt(0)}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-white font-semibold text-base">{item.name}</Text>
                                            <Text className="text-text-muted text-sm">{item.phone}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    searchQuery.length > 2 ? (
                                        <Text className="text-text-muted text-center mt-10">No users found</Text>
                                    ) : null
                                }
                            />
                        )}
                    </View>
                </Modal>

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
