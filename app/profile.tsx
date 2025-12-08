import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserProfile, UserProfileResponse } from '../src/api/client';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfileResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);



    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    const loadProfile = async () => {
        try {
            const response = await getUserProfile();
            if (response.success) {
                setUser(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        // Clear user session/token
        await SecureStore.deleteItemAsync('userToken');
        // Reset local state
        setUser(null);
        setLoading(true);
        // Navigate to login
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user ? user.name.charAt(0).toUpperCase() : '👤'}
                        </Text>
                    </View>
                    {loading ? (
                        <ActivityIndicator color="#A78BFA" />
                    ) : (
                        <>
                            <Text style={styles.name}>{user ? user.name : 'Guest'}</Text>
                            <Text style={styles.email}>{user ? user.phone : ''}</Text>
                            {user?.email && <Text style={styles.email}>{user.email}</Text>}
                        </>
                    )}
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push({
                            pathname: '/edit-profile',
                            params: {
                                name: user?.name,
                                email: user?.email,
                                phone: user?.phone,
                                // address: user?.address // Address is not yet in UserProfileResponse, but we'll add it to params if we had it
                            }
                        })}
                    >
                        <View style={styles.menuLeft}>
                            <Ionicons name="person-outline" size={24} color="#A78BFA" style={styles.menuIconStyle} />
                            <Text style={styles.menuText}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="#A78BFA" style={styles.menuIconStyle} />
                            <Text style={styles.menuText}>Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Ionicons name="notifications-outline" size={24} color="#A78BFA" style={styles.menuIconStyle} />
                            <Text style={styles.menuText}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Ionicons name="help-circle-outline" size={24} color="#A78BFA" style={styles.menuIconStyle} />
                            <Text style={styles.menuText}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Ionicons name="settings-outline" size={24} color="#A78BFA" style={styles.menuIconStyle} />
                            <Text style={styles.menuText}>Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
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
    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 48,
        color: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    email: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    menuSection: {
        marginTop: 24,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconStyle: {
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        color: 'white',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,59,48,0.2)',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: 'bold',
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
    navIcon: {
        fontSize: 24,
        marginBottom: 4,
        opacity: 0.5,
    },
    navLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
    },
    scanButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIcon: {
        fontSize: 32,
        color: 'white',
    },
});
