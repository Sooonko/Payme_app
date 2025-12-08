import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        }, [])
    );

    const toggleBalanceVisibility = () => {
        if (!balanceVisible) {
            loadWallet();
        }
        setBalanceVisible(!balanceVisible);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, Jane Doe!</Text>
                </View>
                <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push({ pathname: '/cards', params: { from: 'home' } })}>
                    <Ionicons name="card-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Balance Card */}
                <View style={styles.balanceCard}>
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
                </View>

                {/* Card Carousel */}
                {cards.length > 0 && (
                    <View style={styles.cardCarouselSection}>
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
                    </View>
                )}

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/wallet')}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="paper-plane" size={24} color="white" />
                            </View>
                            <Text style={styles.actionText} numberOfLines={1}>Send</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="download" size={24} color="white" />
                            </View>
                            <Text style={styles.actionText} numberOfLines={1}>Receive</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/topup')}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="add-circle" size={24} color="white" />
                            </View>
                            <Text style={styles.actionText} numberOfLines={1}>Top Up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="cart" size={24} color="white" />
                            </View>
                            <Text style={styles.actionText} numberOfLines={1}>Buy</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
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
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    balanceCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    eyeButton: {
        padding: 4,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },
    // Card Carousel Styles
    cardCarouselSection: {
        marginBottom: 24,
    },
    carouselTitle: {
        fontSize: 18,
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
        borderRadius: 16,
        padding: 20,
        minHeight: 180,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
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
    },
    miniDefaultBadge: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    miniDefaultText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'white',
    },
    miniCardNumber: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        letterSpacing: 2,
        marginTop: 16,
    },
    miniCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    miniCardName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        flex: 1,
        marginRight: 8,
    },
    miniCardExpiry: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    // Quick Actions
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    viewAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAll: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginRight: 4,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    actionButton: {
        alignItems: 'center',
        width: 70,
    },
    actionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '500',
    },
    // Transactions
    transactionsList: {
        gap: 12,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionIconText: {
        fontSize: 20,
    },
    transactionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    transactionSubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    transactionAmount: {
        color: '#4ADE80',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
