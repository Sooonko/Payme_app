import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getWallet } from '../src/api/client';

export default function Home() {
    const router = useRouter();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    const fetchWallet = async () => {
        setLoading(true);
        try {
            const response = await getWallet();
            if (response.success) {
                setBalance(response.data.balance);
            }
        } catch (error) {
            console.error('Failed to fetch wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWallet();
        }, [])
    );

    const toggleBalanceVisibility = () => {
        if (!isBalanceVisible) {
            fetchWallet();
        }
        setIsBalanceVisible(!isBalanceVisible);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, Jane Doe!</Text>
                </View>
                <TouchableOpacity style={styles.notificationIcon}>
                    <Ionicons name="notifications-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <View>
                            <Text style={styles.balanceLabel}>↗ 2.0% today</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={[styles.balanceAmount, !isBalanceVisible && { letterSpacing: 4, minWidth: 150 }]}>
                                        {isBalanceVisible
                                            ? (balance !== null ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00')
                                            : '••••••••'}
                                    </Text>
                                )}
                                <TouchableOpacity onPress={toggleBalanceVisibility} style={{ marginLeft: 10 }}>
                                    <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <View style={styles.viewAllContainer}>
                                <Text style={styles.viewAll}>View all</Text>
                                <Ionicons name="chevron-forward" size={16} color="white" style={{ marginLeft: 4 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.push('/topup')}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/wallet')}>
                            <Ionicons name="arrow-up-outline" size={24} color="white" />
                            <Text style={styles.actionText}>Transfer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="arrow-down-outline" size={24} color="white" />
                            <Text style={styles.actionText}>Receive</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="card-outline" size={24} color="white" />
                            <Text style={styles.actionText}>Buy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="cash-outline" size={24} color="white" />
                            <Text style={styles.actionText}>Sell</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* My Activities */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => router.push('/activity')}>
                            <View style={styles.viewAllContainer}>
                                <Text style={styles.viewAll}>View all</Text>
                                <Ionicons name="chevron-forward" size={16} color="#A78BFA" style={{ marginLeft: 4 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.activityCard}>
                        <View style={styles.activityLeft}>
                            <View style={styles.activityIcon}>
                                <Text style={styles.activityIconText}>₿</Text>
                            </View>
                            <View>
                                <Text style={styles.activityTitle}>SEEME</Text>
                                <Text style={styles.activitySubtitle}>USD 48789.00</Text>
                            </View>
                        </View>
                        <Text style={styles.activityAmount}>+ $1,200.25</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </View >
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
    iconText: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    balanceCard: {
        backgroundColor: '#A78BFA',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        minHeight: 160,
        position: 'relative',
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    balanceLabel: {
        color: 'white',
        fontSize: 14,
        marginBottom: 12,
    },
    balanceAmount: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },
    viewAll: {
        color: 'white',
        fontSize: 14,
    },
    viewAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 28,
        color: '#A78BFA',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        width: '23%',
        aspectRatio: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
    },
    activityCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityIconText: {
        fontSize: 24,
        color: 'white',
    },
    activityTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    activitySubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    activityAmount: {
        color: '#4ADE80',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#16192E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    navItemCenter: {
        flex: 1,
        alignItems: 'center',
        marginTop: -20,
    },
    navIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    navLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
    },
    scanButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIcon: {
        fontSize: 32,
        color: 'white',
    },
});
