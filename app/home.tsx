import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Dimensions, Easing, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardData, getCards, getWallet } from '../src/api/client';

const { width } = Dimensions.get('window');

export default function Home() {
    const { t } = useTranslation();
    const router = useRouter();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<CardData[]>([]);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Banner State
    const [bannerIndex, setBannerIndex] = useState(0);
    const bannerItems = [
        { id: 1, title: "Smart Payment", subtitle: "Pay your bills faster and safer with Payme.", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop" },
        { id: 2, title: "Global Transfer", subtitle: "Send money anywhere in the world instantly.", image: "https://images.unsplash.com/photo-1550565118-3d1428df732f?q=80&w=800&auto=format&fit=crop" },
        { id: 3, title: "Credit Control", subtitle: "Manage your cards and loans in one place.", image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop" }
    ];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
        setBannerIndex(index);
    };
    const slideAnim = useRef(new Animated.Value(30)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    const loadWallet = async () => {
        setLoading(true);
        try {
            const response = await getWallet();
            if (response.success) {
                setBalance(response.data.balance);
            }
        } catch (error) {
            console.error('Failed to load wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCards = async () => {
        try {
            const response = await getCards();
            if (response.success) {
                setCards(response.data);
            }
        } catch (error) {
            console.error('Failed to load cards:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadWallet();
            loadCards();

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

            // Loop floating animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatAnim, {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(floatAnim, {
                        toValue: 0,
                        duration: 3000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, [])
    );

    const ecosystemItems = [
        { id: 'seeme', title: 'seeme', desc: 'Visual identity verification', icon: 'eye-outline', color: '#60A5FA' },
        { id: 'trapme', title: 'trapme', desc: 'Security & anti-fraud', icon: 'shield-outline', color: '#A78BFA' },
        { id: 'netme', title: 'netme', desc: 'Global connection hub', icon: 'globe-outline', color: '#34D399' },
    ];



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
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <Image
                    source={require('../assets/logo/Payme-Logo.svg')}
                    style={styles.brandLogoImage}
                    contentFit="contain"
                />
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.roundAction} onPress={() => router.push('/activity')}>
                        <Ionicons name="time-outline" size={22} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundAction}>
                        <Ionicons name="notifications-outline" size={22} color="white" />
                        <View style={styles.badge} />
                    </TouchableOpacity>

                </View>
            </Animated.View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Total Balance & Card Card */}
                <Animated.View style={[
                    styles.totalBalanceCardWrapper,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <BlurView intensity={30} tint="light" style={styles.totalBalanceCard}>
                        <Text style={styles.totalBalanceLabel}>{t('home.totalBalance')}</Text>
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.totalBalanceAmount}>{`₮${(balance || 24500).toLocaleString()}`}</Text>
                        )}
                        <Animated.View style={{
                            width: '100%',
                            transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) }]
                        }}>
                            <BlurView intensity={70} tint="light" style={styles.glassCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardBrand}>payme</Text>
                                    <Ionicons name="wifi-outline" size={22} color="white" style={{ transform: [{ rotate: '90deg' }] }} />
                                </View>
                                <Text style={styles.cardNumber}>••••  ••••  ••••  3876</Text>
                                <View style={styles.cardFooter}>
                                    <View>
                                        <Text style={styles.cardLabel}>CARD HOLDER</Text>
                                        <Text style={styles.cardHolderName}>JONSON</Text>
                                    </View>
                                    <View style={styles.cardFooterRight}>
                                        <TouchableOpacity
                                            style={styles.cardTopUpBtn}
                                            onPress={() => router.push('/topup')}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="add-circle" size={28} color="white" />
                                        </TouchableOpacity>
                                        <View style={styles.mastercardLogo}>
                                            <View style={[styles.mcCircle, { backgroundColor: 'rgba(255,255,255,0.4)', left: 0 }]} />
                                            <View style={[styles.mcCircle, { backgroundColor: 'rgba(255,255,255,0.6)', left: 12 }]} />
                                        </View>
                                    </View>
                                </View>
                            </BlurView>
                        </Animated.View>
                    </BlurView>
                </Animated.View>

                {/* Banner Section */}
                <View style={{ marginBottom: 20, alignItems: 'center' }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.bannerContainer}
                        style={{ width: width - 40, borderRadius: 16, overflow: 'hidden' }}
                        pagingEnabled
                        decelerationRate="fast"
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {bannerItems.map((item) => (
                            <BlurView key={item.id} intensity={25} tint="light" style={styles.bannerItem}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={[StyleSheet.absoluteFillObject, { opacity: 0.7 }]}
                                    contentFit="cover"
                                />
                                <View style={styles.bannerOverlay} />
                                <View style={styles.bannerContent}>
                                    <View style={styles.bannerTextContainer}>
                                        <Text style={styles.bannerTitle}>{item.title}</Text>
                                        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                                    </View>
                                </View>
                            </BlurView>
                        ))}
                    </ScrollView>

                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        {bannerItems.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === bannerIndex && styles.paginationDotActive
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {ecosystemItems.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.ecosystemCardWrapper,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 30],
                                        outputRange: [0, 30 + (index * 15)]
                                    })
                                }]
                            }
                        ]}
                    >
                        <BlurView intensity={25} tint="light" style={styles.ecosystemCard}>
                            <TouchableOpacity style={styles.ecosystemItemContent} activeOpacity={0.7}>
                                <View style={styles.itemLeft}>
                                    <View style={[styles.itemIconBox, { backgroundColor: item.color + '15' }]}>
                                        <Ionicons name={item.icon as any} size={26} color={item.color} />
                                    </View>
                                    <View>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={styles.itemDesc}>{item.desc}</Text>
                                    </View>
                                </View>
                                <View style={styles.chevronBox}>
                                    <Ionicons name="chevron-forward" size={18} color="white" />
                                </View>
                            </TouchableOpacity>
                        </BlurView>
                    </Animated.View>
                ))}

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    glow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.25,
        filter: 'blur(80px)', // Web/Modern Expo
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 60,
        paddingBottom: 15,
    },
    brandLogoImage: {
        width: 160,
        height: 40,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    roundAction: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F87171',
        borderWidth: 1,
        borderColor: '#312E81',
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    scrollView: {
        flex: 1,
    },
    totalBalanceCardWrapper: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 18,
        overflow: 'hidden',
    },
    totalBalanceCard: {
        backgroundColor: 'rgba(255,255,255,0.015)',
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
    },
    totalBalanceLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    totalBalanceAmount: {
        fontSize: 42,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 25,
    },
    glassCard: {
        width: '100%',
        height: 190,
        borderRadius: 15,
        padding: 24,
        borderWidth: 1.8,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        color: 'white',
        fontSize: 20,
        fontStyle: 'italic',
    },
    cardNumber: {
        fontSize: 22,
        color: 'white',
        letterSpacing: 2.5,
        textAlign: 'center',
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardHolderName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardFooterRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardTopUpBtn: {
        opacity: 0.9,
    },
    mastercardLogo: {
        width: 32,
        height: 20,
        justifyContent: 'center',
    },
    mcCircle: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    ecosystemCardWrapper: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    ecosystemCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.25)',
        borderRadius: 12,
    },
    ecosystemItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    itemIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    itemTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    itemDesc: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 13,
    },
    chevronBox: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    bannerContainer: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    bannerItem: {
        width: width - 40,
        height: 160,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.25)',
        overflow: 'hidden',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    bannerContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-end',
    },
    bannerTextContainer: {
        width: '100%',
    },
    bannerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    bannerSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        lineHeight: 18,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 5,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    paginationDotActive: {
        width: 20,
        backgroundColor: 'white',
    },
});
