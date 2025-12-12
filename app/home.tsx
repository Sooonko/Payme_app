import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardData, getCards, getWallet } from '../src/api/client';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; // Card takes 75% of screen width

// Helper function to get card gradient colors
const getCardColor = (index: number): string => {
    const colors = [
        '#A78BFA', // Purple (default)
        '#60A5FA', // Blue
        '#34D399', // Green
        '#F59E0B', // Orange
        '#EC4899', // Pink
    ];
    return colors[index % colors.length];
};

export default function Home() {
    const router = useRouter();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [cards, setCards] = useState<CardData[]>([]);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

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

    const toggleBalanceVisibility = () => {
        if (!balanceVisible) {
            loadWallet();
        }
        setBalanceVisible(!balanceVisible);
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
                <View>
                    <Text style={styles.greeting}>Hello, Jane Doe!</Text>
                </View>
                <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push({ pathname: '/cards', params: { from: 'home' } })}>
                    <Ionicons name="card-outline" size={20} color="white" />
                </TouchableOpacity>
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Balance Card */}
                <Animated.View
                    style={[
                        styles.balanceCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <TouchableOpacity
                            onPress={toggleBalanceVisibility}
                            style={styles.eyeButton}
                        >
                            <Ionicons
                                name={balanceVisible ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="rgba(255,255,255,0.7)"
                            />
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator color="white" style={{ marginTop: 8 }} />
                    ) : (
                        <Text style={styles.balanceAmount}>
                            {balanceVisible ? `$${(balance || 0).toFixed(2)}` : '••••••'}
                        </Text>
                    )}
                </Animated.View>

                {/* Card Carousel */}
                {cards.length > 0 && (
                    <Animated.View
                        style={[
                            styles.cardCarouselSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }
                        ]}
                    >
                        <Text style={styles.carouselTitle}>My Cards</Text>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH + 16}
                            decelerationRate="fast"
                            contentContainerStyle={styles.cardCarouselContent}
                        >
                            {cards.map((card, index) => (
                                <TouchableOpacity
                                    key={card.id}
                                    style={styles.cardCarouselItem}
                                    onPress={() => router.push({ pathname: '/cards', params: { from: 'home' } })}
                                    activeOpacity={0.9}
                                >
                                    <View style={[
                                        styles.miniCard,
                                        { backgroundColor: getCardColor(index) }
                                    ]}>
                                        <View style={styles.miniCardTop}>
                                            <Ionicons name="card" size={24} color="white" />
                                            <Text style={styles.miniCardType}>{card.cardType}</Text>
                                        </View>
                                        {card.isDefault && (
                                            <View style={styles.miniDefaultBadge}>
                                                <Text style={styles.miniDefaultText}>Default</Text>
                                            </View>
                                        )}
                                        <Text style={styles.miniCardNumber}>
                                            •••• •••• •••• {card.cardNumberLast4}
                                        </Text>
                                        <View style={styles.miniCardBottom}>
                                            <Text style={styles.miniCardName} numberOfLines={1}>
                                                {card.cardHolderName}
                                            </Text>
                                            <Text style={styles.miniCardExpiry}>
                                                {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* Quick Actions */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/wallet')} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#A78BFA', '#8B5CF6']}
                                style={styles.actionIcon}
                            >
                                <Ionicons name="paper-plane" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.actionText} numberOfLines={1}>Send</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#60A5FA', '#3B82F6']}
                                style={styles.actionIcon}
                            >
                                <Ionicons name="download" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.actionText} numberOfLines={1}>Receive</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/topup')} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#34D399', '#10B981']}
                                style={styles.actionIcon}
                            >
                                <Ionicons name="add-circle" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.actionText} numberOfLines={1}>Top Up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                            <LinearGradient
                                colors={['#F59E0B', '#F59E0B']}
                                style={styles.actionIcon}
                            >
                                <Ionicons name="cart" size={24} color="white" />
                            </LinearGradient>
                            <Text style={styles.actionText} numberOfLines={1}>Buy</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Recent Transactions */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity
                            style={styles.viewAllContainer}
                            onPress={() => router.push('/activity')}
                        >
                            <Text style={styles.viewAll}>View all</Text>
                            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.transactionsList}>
                        <View style={styles.transactionItem}>
                            <View style={styles.transactionLeft}>
                                <View style={styles.transactionIcon}>
                                    <Text style={styles.transactionIconText}>₿</Text>
                                </View>
                                <View>
                                    <Text style={styles.transactionTitle}>SEEME</Text>
                                    <Text style={styles.transactionSubtitle}>USD 48789.00</Text>
                                </View>
                            </View>
                            <Text style={styles.transactionAmount}>+$1,200</Text>
                        </View>
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
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    balanceCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '500',
    },
    eyeButton: {
        padding: 4,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
        marginTop: 4,
    },
    // Card Carousel Styles
    cardCarouselSection: {
        marginBottom: 32,
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    cardCarouselContent: {
        paddingRight: 20,
    },
    cardCarouselItem: {
        width: CARD_WIDTH,
        marginRight: 16,
    },
    miniCard: {
        borderRadius: 24,
        padding: 24,
        minHeight: 180,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    miniCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    miniCardType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
        opacity: 0.9,
    },
    miniDefaultBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    miniDefaultText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    miniCardNumber: {
        fontSize: 22,
        fontWeight: '600',
        color: 'white',
        letterSpacing: 3,
        marginTop: 24,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    miniCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    miniCardName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        flex: 1,
        marginRight: 8,
        textTransform: 'uppercase',
    },
    miniCardExpiry: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    // Quick Actions
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    viewAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    viewAll: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
        marginRight: 4,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        alignItems: 'center',
        width: 72,
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    actionText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '500',
    },
    // Transactions
    transactionsList: {
        gap: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(167, 139, 250, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    transactionIconText: {
        fontSize: 24,
    },
    transactionTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    transactionSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
    },
    transactionAmount: {
        color: '#4ADE80',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
