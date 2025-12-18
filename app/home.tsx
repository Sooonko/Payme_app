import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Dimensions, Easing, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: '#3B82F6', width: 350, height: 350, opacity: 0.15 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: '#EC4899', width: 380, height: 380, opacity: 0.18 }]} />
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
                                    <View style={styles.mastercardLogo}>
                                        <View style={[styles.mcCircle, { backgroundColor: 'rgba(255,255,255,0.4)', left: 0 }]} />
                                        <View style={[styles.mcCircle, { backgroundColor: 'rgba(255,255,255,0.6)', left: 12 }]} />
                                    </View>
                                </View>
                            </BlurView>
                        </Animated.View>
                    </BlurView>
                </Animated.View>
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
        borderRadius: 40,
        overflow: 'hidden',
    },
    totalBalanceCard: {
        backgroundColor: 'rgba(255,255,255,0.015)',
        padding: 24,
        alignItems: 'center',
        borderWidth: 1.2,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 40,
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
        borderRadius: 30,
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
        borderRadius: 30,
        overflow: 'hidden',
    },
    ecosystemCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderWidth: 1.2,
        borderColor: 'rgba(255,255,255,0.25)',
        borderRadius: 30,
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
        borderRadius: 20,
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
});
