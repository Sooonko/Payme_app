import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchUsers, UserSearchResponse } from '../src/api/client';

export default function UserSearch() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResponse['data']>([]);
    const [loading, setLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Reset search state when page is focused
    useFocusEffect(
        useCallback(() => {
            setSearchQuery('');
            setSearchResults([]);

            // Start entrance animations
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start();
        }, [])
    );

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

    return (
        <LinearGradient
            colors={['#1E1B4B', '#312E81', '#4C1D95', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Recipient</Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <Animated.View
                    style={[
                        styles.searchContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Search by name or phone"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        style={styles.searchInput}
                        autoFocus={true}
                    />
                </Animated.View>

                {/* Search Results */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.sectionTitle}>Search Results</Text>
                    {loading ? (
                        <ActivityIndicator color="#A78BFA" style={{ marginBottom: 20 }} />
                    ) : (
                        <View style={styles.contactsList}>
                            {searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <TouchableOpacity
                                        key={user.userId}
                                        style={styles.contactCard}
                                        onPress={() => router.push({
                                            pathname: '/wallet',
                                            params: {
                                                userId: user.userId,
                                                name: user.name,
                                                phone: user.phone,
                                                walletId: user.walletId,
                                                amount: params.amount as string
                                            }
                                        })}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.contactLeft}>
                                            <View style={styles.contactAvatar}>
                                                <Text style={styles.contactAvatarText}>{user.name.charAt(0)}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.contactName}>{user.name}</Text>
                                                <Text style={styles.contactPhone}>{user.phone}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.selectButton}>
                                            <Ionicons name="arrow-forward" size={16} color="white" />
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                searchQuery.length > 2 && <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 20 }}>No users found</Text>
                            )}
                        </View>
                    )}
                </Animated.View>

                {/* Quick Send */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.sectionTitle}>Quick Send</Text>
                    <View style={styles.quickSendContainer}>
                        <TouchableOpacity style={styles.quickSendButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#A78BFA', '#8B5CF6']}
                                style={styles.quickSendIcon}
                            >
                                <Ionicons name="call" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.quickSendText}>Phone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickSendButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#60A5FA', '#3B82F6']}
                                style={styles.quickSendIcon}
                            >
                                <Ionicons name="mail" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.quickSendText}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickSendButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#34D399', '#10B981']}
                                style={styles.quickSendIcon}
                            >
                                <Ionicons name="qr-code" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.quickSendText}>QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButtonContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    contactsList: {
        marginBottom: 32,
    },
    contactCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    contactAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    contactAvatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    contactName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactPhone: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    selectButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickSendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    quickSendButton: {
        alignItems: 'center',
        width: 80,
    },
    quickSendIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    quickSendText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontWeight: '500',
    },
});
