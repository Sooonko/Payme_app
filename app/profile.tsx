import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserProfile, UserProfileResponse } from '../src/api/client';
import { useTheme } from '../src/contexts/ThemeContext';

// Memoized Background component to prevent flicker during language changes
const ProfileBackground = React.memo(({ colors, isDark }: { colors: any, isDark: boolean }) => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: colors.glows[0], width: 400, height: 400, opacity: isDark ? 0.18 : 0.25 }]} />
        <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: colors.glows[1], width: 350, height: 350, opacity: isDark ? 0.15 : 0.2 }]} />
        <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: colors.glows[2], width: 380, height: 380, opacity: isDark ? 0.18 : 0.25 }]} />
    </View>
));

export default function Profile() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [user, setUser] = useState<UserProfileResponse['data'] | null>(null);
    const [loading, setLoading] = useState(false); // Default to false to prevent initial loading "cover"
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [themeModalVisible, setThemeModalVisible] = useState(false);
    const { colors, isDark, mode, setMode } = useTheme();

    // Unified animation values with static initial states
    // Initialize to final values (1 and 0) to prevent flicker on re-renders/re-mounts
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const hasAnimated = useRef(false);

    const isInitialLoad = useRef(true);

    useFocusEffect(
        useCallback(() => {
            loadProfile(isInitialLoad.current);
            isInitialLoad.current = false;

            // Only run entrance animations if they haven't run before
            if (!hasAnimated.current) {
                fadeAnim.setValue(0);
                slideAnim.setValue(50);

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
                ]).start(() => {
                    hasAnimated.current = true;
                });
            }
        }, [])
    );

    const loadProfile = async (isInitial = false) => {
        if (isInitial && !user) setLoading(true);
        try {
            const response = await getUserProfile();
            if (response.success) {
                setUser(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
        setUser(null);
        setLoading(true);
        router.replace('/login');
    };

    const formatMemberSince = (dateString: string) => {
        const date = new Date(dateString);
        return t('profile.memberSince', { date: date.toLocaleDateString() });
    };

    const changeLanguage = async (lang: string) => {
        setLanguageModalVisible(false);
        // Wait for modal to close before changing language to prevent visual jank
        setTimeout(async () => {
            try {
                await i18n.changeLanguage(lang);
            } catch (error) {
                console.error('Failed to change language', error);
            }
        }, 300);
    };

    return (
        <LinearGradient
            colors={colors.backgroundGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <ProfileBackground colors={colors} isDark={isDark} />

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

                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Info Card */}
                <Animated.View
                    style={[
                        styles.profileCardWrapper,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                            borderColor: colors.glassBorder,
                        }
                    ]}
                >
                    <View style={[styles.profileCard, { backgroundColor: colors.glassBackground }]}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#A78BFA', colors.tint]}
                                style={styles.avatarGradient}
                            >
                                <View style={[styles.avatar, { backgroundColor: isDark ? '#1E1B4B' : '#E0E7FF' }]}>
                                    <Text style={styles.avatarText}>
                                        {user ? user.name.charAt(0).toUpperCase() : '👤'}
                                    </Text>
                                </View>
                            </LinearGradient>
                            <TouchableOpacity
                                style={[styles.editAvatarButton, { backgroundColor: colors.tint, borderColor: isDark ? '#1E1B4B' : '#E0E7FF' }]}
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
                            <ActivityIndicator color={colors.tint} style={{ marginTop: 16 }} />
                        ) : (
                            <>
                                <Text style={[styles.name, { color: colors.text }]}>{user ? user.name : t('profile.guest')}</Text>
                                <View style={styles.contactInfo}>
                                    <View style={styles.contactItem}>
                                        <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                                        <Text style={[styles.contactText, { color: colors.text }]}>{user ? user.phone : ''}</Text>
                                    </View>
                                    {user?.email && (
                                        <View style={styles.contactItem}>
                                            <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                                            <Text style={[styles.contactTextSecondary, { color: colors.textSecondary }]}>{user.email}</Text>
                                        </View>
                                    )}
                                </View>
                                {user?.createdAt && (
                                    <View style={[styles.memberSince, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                                        <Text style={[styles.memberSinceText, { color: colors.textSecondary }]}>
                                            {formatMemberSince(user.createdAt)}
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
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
                    <View style={[styles.menuItemWrapper, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
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
                                    colors={['#A78BFA', colors.tint]}
                                    style={styles.menuIconGradient}
                                >
                                    <Ionicons name="person-outline" size={20} color="white" />
                                </LinearGradient>
                                <Text style={[styles.menuText, { color: colors.text }]}>{t('profile.editProfile')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.menuItemWrapper, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <LinearGradient
                                    colors={['#60A5FA', '#3B82F6']}
                                    style={styles.menuIconGradient}
                                >
                                    <Ionicons name="shield-checkmark-outline" size={20} color="white" />
                                </LinearGradient>
                                <Text style={[styles.menuText, { color: colors.text }]}>{t('profile.security')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.menuItemWrapper, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
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
                                <Text style={[styles.menuText, { color: colors.text }]}>{t('profile.myCards')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.menuItemWrapper, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <LinearGradient
                                    colors={['#F59E0B', '#D97706']}
                                    style={styles.menuIconGradient}
                                >
                                    <Ionicons name="help-circle-outline" size={20} color="white" />
                                </LinearGradient>
                                <Text style={[styles.menuText, { color: colors.text }]}>{t('profile.helpSupport')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.menuItemWrapper, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <LinearGradient
                                    colors={['#EC4899', '#DB2777']}
                                    style={styles.menuIconGradient}
                                >
                                    <Ionicons name="settings-outline" size={20} color="white" />
                                </LinearGradient>
                                <Text style={[styles.menuText, { color: colors.text }]}>{t('profile.settings')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.menuItemWrapper, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
                            onPress={() => setLanguageModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <LinearGradient
                                    colors={['#8B5CF6', colors.tint]}
                                    style={styles.menuIconGradient}
                                >
                                    <Ionicons name="language-outline" size={20} color="white" />
                                </LinearGradient>
                                <Text style={[styles.menuText, { color: colors.text }]}>{t('profile.language')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: colors.textSecondary, marginRight: 8 }}>
                                    {i18n.language === 'mn' ? 'Монгол' : i18n.language === 'ko' ? '한국어' : 'English'}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.menuItemWrapper, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
                            onPress={() => setThemeModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <LinearGradient
                                    colors={['#60A5FA', '#3B82F6']}
                                    style={styles.menuIconGradient}
                                >
                                    <Ionicons name={isDark ? "moon-outline" : "sunny-outline"} size={20} color="white" />
                                </LinearGradient>
                                <Text style={[styles.menuText, { color: colors.text }]}>{t('profile.theme')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: colors.textSecondary, marginRight: 8 }}>
                                    {t(`profile.modes.${mode}`)}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    </View>
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
                            <Ionicons name="log-out-outline" size={24} color={isDark ? "#FF3B30" : "#EF4444"} />
                            <Text style={[styles.logoutText, { color: isDark ? "#FF3B30" : "#EF4444" }]}>{t('profile.logout')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={languageModalVisible}
                onRequestClose={() => setLanguageModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={[styles.modalContent, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('profile.selectLanguage')}</Text>
                            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.languageOption, { borderBottomColor: colors.border }]} onPress={() => changeLanguage('en')}>
                            <Text style={[styles.languageText, { color: colors.textSecondary }, i18n.language === 'en' && { color: colors.tint, fontWeight: 'bold' }]}>English</Text>
                            {i18n.language === 'en' && <Ionicons name="checkmark" size={24} color={colors.tint} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.languageOption, { borderBottomColor: colors.border }]} onPress={() => changeLanguage('mn')}>
                            <Text style={[styles.languageText, { color: colors.textSecondary }, i18n.language === 'mn' && { color: colors.tint, fontWeight: 'bold' }]}>Монгол</Text>
                            {i18n.language === 'mn' && <Ionicons name="checkmark" size={24} color={colors.tint} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.languageOption, { borderBottomColor: colors.border }]} onPress={() => changeLanguage('ko')}>
                            <Text style={[styles.languageText, { color: colors.textSecondary }, i18n.language === 'ko' && { color: colors.tint, fontWeight: 'bold' }]}>한국어</Text>
                            {i18n.language === 'ko' && <Ionicons name="checkmark" size={24} color={colors.tint} />}
                        </TouchableOpacity>
                    </BlurView>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={themeModalVisible}
                onRequestClose={() => setThemeModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={[styles.modalContent, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('profile.selectTheme')}</Text>
                            <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        {(['light', 'dark'] as const).map((tMode) => (
                            <TouchableOpacity
                                key={tMode}
                                style={[styles.languageOption, { borderBottomColor: colors.border }]}
                                onPress={() => {
                                    setMode(tMode);
                                    setThemeModalVisible(false);
                                }}
                            >
                                <Text style={[styles.languageText, { color: colors.textSecondary }, mode === tMode && { color: colors.tint, fontWeight: 'bold' }]}>
                                    {t(`profile.modes.${tMode}`)}
                                </Text>
                                {mode === tMode && <Ionicons name="checkmark" size={24} color={colors.tint} />}
                            </TouchableOpacity>
                        ))}
                    </BlurView>
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
    contactInfo: {
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    contactTextSecondary: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
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
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderWidth: 1,
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
