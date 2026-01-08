import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, FlatList, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTransactionHistory, TransactionHistoryResponse } from '../src/api/client';
import { useTheme } from '../src/contexts/ThemeContext';

type FilterType = 'all' | 'income' | 'expense';

export default function Activity() {
    const { t, i18n } = useTranslation();
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const [transactions, setTransactions] = useState<TransactionHistoryResponse['data']>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const loadTransactions = async () => {
        try {
            const response = await getTransactionHistory();
            if (response.success) {
                // Sort by date descending (newest first)
                const sortedData = response.data.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setTransactions(sortedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTransactions();

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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadTransactions();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(i18n.language, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate statistics
    const stats = transactions.reduce((acc, transaction) => {
        if (transaction.flow === 'INFLOW') {
            acc.income += transaction.amount;
        } else {
            acc.expense += transaction.amount;
        }
        return acc;
    }, { income: 0, expense: 0 });

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        if (filter === 'income') return transaction.flow === 'INFLOW';
        if (filter === 'expense') return transaction.flow === 'OUTFLOW';
        return true;
    });

    const renderItem = ({ item }: { item: TransactionHistoryResponse['data'][0] }) => {
        const isIncome = item.flow === 'INFLOW';

        return (
            <Animated.View
                style={[
                    styles.transactionItem,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                        backgroundColor: colors.glassBackground,
                        borderColor: colors.glassBorder,
                    }
                ]}
            >
                <LinearGradient
                    colors={isIncome ? ['rgba(74, 222, 128, 0.15)', 'rgba(74, 222, 128, 0.05)'] : ['rgba(248, 113, 113, 0.15)', 'rgba(248, 113, 113, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconContainer}
                >
                    <Ionicons
                        name={isIncome ? "arrow-down" : "arrow-up"}
                        size={24}
                        color={isIncome ? "#4ADE80" : "#F87171"}
                    />
                </LinearGradient>
                <View style={styles.detailsContainer}>
                    <Text style={[styles.description, { color: colors.text }]}>{item.description || item.type}</Text>
                    <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(item.createdAt)}</Text>
                </View>
                <Text style={[styles.amount, { color: isIncome ? '#4ADE80' : '#F87171' }]}>
                    {isIncome ? '+' : '-'}₮{item.amount.toFixed(2)}
                </Text>
            </Animated.View>
        );
    };

    return (
        <LinearGradient
            colors={colors.backgroundGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
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
                    style={[styles.backButton, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('activity.title')}</Text>
                <View style={{ width: 44 }} />
            </Animated.View>
            <Animated.View
                style={[
                    styles.statsCard,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                        backgroundColor: colors.glassBackground,
                        borderColor: colors.glassBorder,
                    }
                ]}
            >
                <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                        <LinearGradient
                            colors={['#4ADE80', '#10B981']}
                            style={styles.statIcon}
                        >
                            <Ionicons name="arrow-down" size={20} color="white" />
                        </LinearGradient>
                    </View>
                    <View>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('activity.income')}</Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>{`₮${stats.income.toFixed(2)}`}</Text>
                    </View>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                        <LinearGradient
                            colors={['#F87171', '#EF4444']}
                            style={styles.statIcon}
                        >
                            <Ionicons name="arrow-up" size={20} color="white" />
                        </LinearGradient>
                    </View>
                    <View>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('activity.expense')}</Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>{`₮${stats.expense.toFixed(2)}`}</Text>
                    </View>
                </View>
            </Animated.View>
            <Animated.View
                style={[
                    styles.filterContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                <TouchableOpacity
                    style={[styles.filterChip, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }, filter === 'all' && { backgroundColor: colors.tint, borderColor: colors.tint }]}
                    onPress={() => setFilter('all')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.filterText, { color: colors.textSecondary }, filter === 'all' && { color: 'white' }]}>{t('activity.all')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }, filter === 'income' && { backgroundColor: colors.tint, borderColor: colors.tint }]}
                    onPress={() => setFilter('income')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.filterText, { color: colors.textSecondary }, filter === 'income' && { color: 'white' }]}>{t('activity.income')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }, filter === 'expense' && { backgroundColor: colors.tint, borderColor: colors.tint }]}
                    onPress={() => setFilter('expense')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.filterText, { color: colors.textSecondary }, filter === 'expense' && { color: 'white' }]}>{t('activity.expense')}</Text>
                </TouchableOpacity>
            </Animated.View>
            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator color={colors.tint} size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A78BFA" />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Ionicons name="receipt-outline" size={64} color={colors.border} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('activity.noTransactions')}</Text>
                        </View>
                    }
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 15,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statIconContainer: {
        marginRight: 12,
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        marginBottom: 4,
    },
    statValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    filterChipActive: {
        backgroundColor: '#A78BFA',
        borderColor: '#A78BFA',
    },
    filterText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '600',
    },
    filterTextActive: {
        color: 'white',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailsContainer: {
        flex: 1,
    },
    description: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    date: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
    },
    amount: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        marginTop: 16,
    },
});
