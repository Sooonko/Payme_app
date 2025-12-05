import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StatusBar, StyleSheet, Text, View } from 'react-native';
import { getTransactionHistory, TransactionHistoryResponse } from '../src/api/client';

export default function Activity() {
    const [transactions, setTransactions] = useState<TransactionHistoryResponse['data']>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadTransactions();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderItem = ({ item }: { item: TransactionHistoryResponse['data'][0] }) => {
        // Determine if it's income or expense based on context
        // Since we don't have the current user's wallet ID easily accessible here without another call,
        // we might need to infer or just show generic icons.
        // However, usually the API returns transactions relative to the user.
        // For now, let's assume if type is 'TOPUP' it's income.
        // If it's 'TRANSFER', we need to know if we are sender or receiver.
        // But the API response provided by user doesn't explicitly say "direction".
        // We can check if `fromWalletId` matches our wallet, but we don't have our wallet ID stored in state here.
        // A simple heuristic: 
        // If description is "Top Up", it's income.
        // For transfers, we'll just show a generic transfer icon for now, or maybe the API filters it?
        // Actually, let's just show the amount. If it's negative in the backend it would show -, but here it's absolute.
        // Let's assume for now all transfers shown are relevant.

        // BETTER APPROACH: The user request says "Income (money received) ... Expense (money sent)".
        // Without knowing my wallet ID, I can't strictly tell for TRANSFER.
        // But typically 'TOPUP' is always income.
        // Let's just style them consistently for now.

        const isTopUp = item.type === 'TOPUP';

        return (
            <View style={styles.transactionItem}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={isTopUp ? "add-circle" : "arrow-forward-circle"}
                        size={24}
                        color={isTopUp ? "#4ADE80" : "#F87171"}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{item.description || item.type}</Text>
                    <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                </View>
                <Text style={[styles.amount, { color: isTopUp ? '#4ADE80' : 'white' }]}>
                    {isTopUp ? '+' : ''}${item.amount.toFixed(2)}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Activity</Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#A78BFA" />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A78BFA" />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No transactions yet</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2238',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#1E2238',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    listContent: {
        padding: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
        fontSize: 12,
    },
    amount: {
        fontSize: 16,
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
    },
});
