import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserProfile, UserProfileResponse } from '../src/api/client';

export default function Profile() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [user, setUser] = useState<UserProfileResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);

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
        return t('profile.memberSince', { date: date.toLocaleDateString() });
    };

    const changeLanguage = async (lang: string) => {
        try {
            await i18n.changeLanguage(lang);
            setLanguageModalVisible(false);
        } catch (error) {
            console.error('Failed to change language', error);
        }
    };

    return (
        <LinearGradient
            colors={['#1a1642', '#221a52', '#311a63', '#421a52', '#4a1a4a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Background Glows */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: '#4F46E5', width: 400, height: 400, opacity: 0.18 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: '#4f7abdff', width: 350, height: 350, opacity: 0.15 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: '#ae4479ff', width: 380, height: 380, opacity: 0.18 }]} />
            </View>

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

                <Text style={styles.headerTitle}>{t('profile.title')}</Text>
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Info Card */}
                <Animated.View
                    style={[
                        styles.profileCardWrapper,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <BlurView intensity={30} tint="light" style={styles.profileCard}>
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
                                <Text style={styles.name}>{user ? user.name : t('profile.guest')}</Text>
                                <Text style={styles.email}>{user ? user.phone : ''}</Text>
                                {user?.email && <Text style={styles.emailSecondary}>{user.email}</Text>}
                                {user?.createdAt && (
                                    <View style={styles.memberSince}>
                                        <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.5)" />
                                        <Text style={styles.memberSinceText}>
                                            {formatMemberSince(user.createdAt)}
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </BlurView>
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
                    <BlurView intensity={25} tint="light" style={styles.menuItemWrapper}>
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
                                <Text style={styles.menuText}>{t('profile.editProfile')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </TouchableOpacity>
                    </BlurView>

                    <BlurView intensity={25} tint="light" style={styles.menuItemWrapper}>
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
                                <Text style={styles.menuText}>{t('profile.security')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </TouchableOpacity>
                    </BlurView>

                    <BlurView intensity={25} tint="light" style={styles.menuItemWrapper}>
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
                                <Text style={styles.menuText}>{t('profile.myCards')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </TouchableOpacity>
                    </BlurView>

                    <BlurView intensity={25} tint="light" style={styles.menuItemWrapper}>
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
                                <Text style={styles.menuText}>{t('profile.helpSupport')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </TouchableOpacity>
                    </BlurView>

                    <BlurView intensity={25} tint="light" style={styles.menuItemWrapper}>
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
                                <Text style={styles.menuText}>{t('profile.settings')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </TouchableOpacity>
                    </BlurView>

                    <BlurView intensity={25} tint="light" style={styles.menuItemWrapper}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => setLanguageModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <LinearGradient
                                    colors={['#8B5CF6', '#7C3AED']}
                                    style={styles.menuIconGradient}
                                >
                                    <Ionicons name="language-outline" size={20} color="white" />
                                </LinearGradient>
                                <Text style={styles.menuText}>{t('profile.language')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'rgba(255,255,255,0.5)', marginRight: 8 }}>
                                    {i18n.language === 'mn' ? 'Монгол' : 'English'}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                            </View>
                        </TouchableOpacity>
                    </BlurView>
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
                            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={languageModalVisible}
                onRequestClose={() => setLanguageModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('profile.selectLanguage')}</Text>
                            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.languageOption} onPress={() => changeLanguage('en')}>
                            <Text style={[styles.languageText, i18n.language === 'en' && styles.activeLanguageText]}>English</Text>
                            {i18n.language === 'en' && <Ionicons name="checkmark" size={24} color="#A78BFA" />}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.languageOption} onPress={() => changeLanguage('mn')}>
                            <Text style={[styles.languageText, i18n.language === 'mn' && styles.activeLanguageText]}>Монгол</Text>
                            {i18n.language === 'mn' && <Ionicons name="checkmark" size={24} color="#A78BFA" />}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    glow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.25,
        filter: 'blur(80px)',
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
    profileCardWrapper: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    profileCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 24,
        alignItems: 'center',
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
        gap: 16,
        marginBottom: 24,
    },
    menuItemWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 16,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1642',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    languageOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    languageText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    activeLanguageText: {
        color: '#A78BFA',
        fontWeight: 'bold',
    },
});
