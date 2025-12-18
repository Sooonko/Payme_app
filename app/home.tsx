import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        }, [])
    );

    const ecosystemItems = [
        { id: 'seeme', title: 'seeme', desc: 'Visual identity verification', icon: 'eye-outline', color: '#60A5FA' },
        { id: 'trapme', title: 'trapme', desc: 'Security & anti-fraud', icon: 'shield-outline', color: '#A78BFA' },
        { id: 'netme', title: 'netme', desc: 'Global connection hub', icon: 'globe-outline', color: '#34D399' },
    ];



    return (
        <LinearGradient
            colors={['#1E1B4B', '#312E81', '#4C1D95', '#5B21B6']} // Enhanced gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
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
                <Animated.View style={[styles.totalBalanceCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.totalBalanceLabel}>TOTAL BALANCE</Text>
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.totalBalanceAmount}>₮{(balance || 24500).toLocaleString()}</Text>
                    )}

                    <View style={styles.glassCard}>
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
                    </View>
                </Animated.View>

                {/* Ecosystem Section */}
                <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>Ecosystem</Text>
                        <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
                    </View>
                    <View style={styles.ecosystemContainer}>
                        {ecosystemItems.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.ecosystemItem}>
                                <View style={styles.itemLeft}>
                                    <View style={[styles.itemIconBox, { backgroundColor: item.color + '20' }]}>
                                        <Ionicons name={item.icon as any} size={24} color={item.color} />
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
                        ))}
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
        paddingHorizontal: 25,
        paddingTop: 60,
        paddingBottom: 15,
    },
    brandLogoImage: {
        width: 120,
        height: 30,
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
    totalBalanceCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 40,
        marginHorizontal: 20,
        padding: 24,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 30,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'space-between',
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
    section: {
        marginHorizontal: 20,
        marginBottom: 25,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 35,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    seeAllText: {
        color: '#818CF8',
        fontSize: 13,
        fontWeight: '600',
    },
    ecosystemContainer: {
        gap: 20,
    },
    ecosystemItem: {
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
        width: 54,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    itemTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 2,
    },
    itemDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
    },
    chevronBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentList: {
        gap: 18,
    },
    recentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recentIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    recentAmount: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
