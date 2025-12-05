import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchUsers, UserSearchResponse } from '../src/api/client';

export default function UserSearch() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResponse['data']>([]);
    const [loading, setLoading] = useState(false);

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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Money</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Search by name or phone"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        style={styles.searchInput}
                    />
                </View>

                {/* Search Results */}
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
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                                </TouchableOpacity>
                            ))
                        ) : (
                            searchQuery.length > 2 && <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 20 }}>No users found</Text>
                        )}
                    </View>
                )}

                {/* Quick Send */}
                <Text style={styles.sectionTitle}>Quick Send</Text>
                <View style={styles.quickSendContainer}>
                    <TouchableOpacity style={styles.quickSendButton}>
                        <View style={styles.quickSendIcon}>
                            <Ionicons name="call-outline" size={28} color="white" />
                        </View>
                        <Text style={styles.quickSendText}>Phone Number</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickSendButton}>
                        <View style={styles.quickSendIcon}>
                            <Ionicons name="mail-outline" size={28} color="white" />
                        </View>
                        <Text style={styles.quickSendText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickSendButton}>
                        <View style={styles.quickSendIcon}>
                            <Ionicons name="qr-code-outline" size={28} color="white" />
                        </View>
                        <Text style={styles.quickSendText}>QR Code</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2238',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        fontSize: 28,
        color: 'white',
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
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactAvatarText: {
        fontSize: 24,
    },
    contactName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactPhone: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
    quickSendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    quickSendButton: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    quickSendIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickSendText: {
        color: 'white',
        fontSize: 12,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#16192E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    navItemCenter: {
        flex: 1,
        alignItems: 'center',
        marginTop: -20,
    },
    navLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        marginTop: 4,
    },
    scanButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
