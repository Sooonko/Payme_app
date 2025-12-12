import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserProfile, UserProfileResponse } from '../src/api/client';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfileResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useFocusEffect(
        useCallback(() => {
            loadProfile();

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
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
        setLoading(true);
        router.replace('/login');
    };

    const formatMemberSince = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
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
                <Text style={styles.headerTitle}>Profile</Text>
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Info Card */}
                <Animated.View
                    style={[
                        styles.profileCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#A78BFA', '#8B5CF6']}
                            style={styles.avatarGradient}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user ? user.name.charAt(0).toUpperCase() : '👤'}
                                </Text>
                            </View>
                        </LinearGradient>
                        <TouchableOpacity
                            style={styles.editAvatarButton}
                            onPress={() => router.push({
                                pathname: '/edit-profile',
                                params: {
                                    name: user?.name,
                                    email: user?.email,
                                    phone: user?.phone,
                                }
                            })}
                        >
                            <Ionicons name="pencil" size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#A78BFA" style={{ marginTop: 16 }} />
                    ) : (
                        <>
                            <Text style={styles.name}>{user ? user.name : 'Guest'}</Text>
                            <Text style={styles.email}>{user ? user.phone : ''}</Text>
                            {user?.email && <Text style={styles.emailSecondary}>{user.email}</Text>}
                            {user?.createdAt && (
                                <View style={styles.memberSince}>
                                    <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.5)" />
                                    <Text style={styles.memberSinceText}>
                                        Member since {formatMemberSince(user.createdAt)}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </Animated.View>

                {/* Menu Items */}
                <Animated.View
                    style={[
                        styles.menuSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push({
                            pathname: '/edit-profile',
                            params: {
                                name: user?.name,
                                email: user?.email,
                                phone: user?.phone,
                            }
                        })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuLeft}>
                            <LinearGradient
                                colors={['#A78BFA', '#8B5CF6']}
                                style={styles.menuIconGradient}
                            >
                                <Ionicons name="person-outline" size={20} color="white" />
                            </LinearGradient>
                            <Text style={styles.menuText}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuLeft}>
                            <LinearGradient
                                colors={['#60A5FA', '#3B82F6']}
                                style={styles.menuIconGradient}
                            >
                                <Ionicons name="shield-checkmark-outline" size={20} color="white" />
                            </LinearGradient>
                            <Text style={styles.menuText}>Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push({ pathname: '/cards', params: { from: 'profile' } })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuLeft}>
                            <LinearGradient
                                colors={['#34D399', '#10B981']}
                                style={styles.menuIconGradient}
                            >
                                <Ionicons name="card-outline" size={20} color="white" />
                            </LinearGradient>
                            <Text style={styles.menuText}>My Cards</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuLeft}>
                            <LinearGradient
                                colors={['#F59E0B', '#D97706']}
                                style={styles.menuIconGradient}
                            >
                                <Ionicons name="help-circle-outline" size={20} color="white" />
                            </LinearGradient>
                            <Text style={styles.menuText}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuLeft}>
                            <LinearGradient
                                colors={['#EC4899', '#DB2777']}
                                style={styles.menuIconGradient}
                            >
                                <Ionicons name="settings-outline" size={20} color="white" />
                            </LinearGradient>
                            <Text style={styles.menuText}>Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Logout Button */}
                <Animated.View
                    style={[
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
                        <LinearGradient
                            colors={['rgba(255,59,48,0.2)', 'rgba(239,68,68,0.1)']}
                            style={styles.logoutGradient}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarGradient: {
        padding: 4,
        borderRadius: 64,
    },
    avatar: {
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#1E1B4B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 48,
        color: 'white',
        fontWeight: 'bold',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1E1B4B',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 6,
    },
    email: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    emailSecondary: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    memberSince: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        gap: 6,
    },
    memberSinceText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    menuSection: {
        gap: 12,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    logoutButton: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
    },
    logoutGradient: {
        flexDirection: 'row',
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,59,48,0.3)',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
