import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchUsers, UserSearchResponse } from '../src/api/client';
import { useTheme } from '../src/contexts/ThemeContext';

export default function UserSearch() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, isDark } = useTheme();
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
            colors={colors.backgroundGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: colors.glows[0], width: 400, height: 400, opacity: isDark ? 0.18 : 0.25 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: colors.glows[1], width: 350, height: 350, opacity: isDark ? 0.15 : 0.2 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: colors.glows[2], width: 380, height: 380, opacity: isDark ? 0.18 : 0.25 }]} />
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
                <TouchableOpacity
                    onPress={() => params.from === 'scan' ? router.navigate('/scan') : router.back()}
                    style={styles.backButtonContainer}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('userSearch.title')}</Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                        marginBottom: 24,
                    }}
                >
                    <BlurView intensity={isDark ? 30 : 50} tint={isDark ? "dark" : "light"} style={[styles.searchContainer, { borderColor: colors.glassBorder }]}>
                        <Ionicons name="search" size={20} color={colors.textSecondary} />
                        <TextInput
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholder={t('userSearch.searchPlaceholder')}
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.searchInput, { color: colors.text }]}
                            autoFocus={true}
                        />
                    </BlurView>
                </Animated.View>

                {/* Search Results */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('userSearch.section.results')}</Text>
                    {loading ? (
                        <ActivityIndicator color="#A78BFA" style={{ marginBottom: 20 }} />
                    ) : (
                        <View style={styles.contactsList}>
                            {searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <TouchableOpacity
                                        key={user.userId}
                                        onPress={() => router.push({
                                            pathname: '/transfer-confirm',
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
                                        <BlurView intensity={isDark ? 20 : 50} tint={isDark ? "light" : "default"} style={[styles.contactCard, { borderColor: colors.glassBorder }]}>
                                            <View style={styles.contactLeft}>
                                                <View style={[styles.contactAvatar, { backgroundColor: colors.tint, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]}>
                                                    <Text style={styles.contactAvatarText}>{user.name.charAt(0)}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[styles.contactName, { color: colors.text }]}>{user.name}</Text>
                                                    <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{user.phone}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.selectButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                                <Ionicons name="arrow-forward" size={16} color="white" />
                                            </View>
                                        </BlurView>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                searchQuery.length > 2 && <Text style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 20 }}>{t('userSearch.noUsers')}</Text>
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
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('userSearch.section.quickSend')}</Text>
                    <View style={styles.quickSendContainer}>
                        <TouchableOpacity style={styles.quickSendButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#A78BFA', '#8B5CF6']}
                                style={styles.quickSendIcon}
                            >
                                <Ionicons name="call" size={24} color="white" />
                            </LinearGradient>
                            <Text style={[styles.quickSendText, { color: colors.textSecondary }]}>{t('userSearch.quickSend.phone')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickSendButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#60A5FA', '#3B82F6']}
                                style={styles.quickSendIcon}
                            >
                                <Ionicons name="mail" size={24} color="white" />
                            </LinearGradient>
                            <Text style={[styles.quickSendText, { color: colors.textSecondary }]}>{t('userSearch.quickSend.email')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickSendButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#34D399', '#10B981']}
                                style={styles.quickSendIcon}
                            >
                                <Ionicons name="qr-code" size={24} color="white" />
                            </LinearGradient>
                            <Text style={[styles.quickSendText, { color: colors.textSecondary }]}>{t('userSearch.quickSend.qrCode')}</Text>
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
    glow: {
        position: 'absolute',
        borderRadius: 200,
        filter: 'blur(80px)',
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
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    searchInput: {
        flex: 1,
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
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        overflow: 'hidden',
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
