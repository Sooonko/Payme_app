import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { sendMoney, UserSearchResponse } from '../src/api/client';

export default function Wallet() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSearchResponse['data'][0] | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const quickAmounts = ['10', '20', '50', '100'];

    useFocusEffect(
        useCallback(() => {
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

            // Only clear state if we're coming from a non-user-search navigation
            // (e.g., from home, bottom nav, etc.)
            const hasUserParams = params.userId && params.name && params.phone && params.walletId;

            if (!hasUserParams && !params.amount) {
                setSelectedUser(null);
                setAmount('');
            }
        }, [params.userId, params.name, params.phone, params.walletId, params.amount])
    );

    useEffect(() => {
        // Update amount when it changes in params
        if (params.amount) {
            setAmount(params.amount as string);
        }

        // Update selected user when params change
        if (params.userId && params.name && params.phone && params.walletId) {
            setSelectedUser({
                userId: params.userId as string,
                name: params.name as string,
                phone: params.phone as string,
                walletId: params.walletId as string
            });
        } else if (!params.userId) {
            // Clear selected user if userId param is removed
            setSelectedUser(null);
        }
    }, [params.userId, params.name, params.phone, params.walletId, params.amount]);

    const handleTransfer = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount.');
            return;
        }

        if (!selectedUser) {
            // Navigate to User Search page to select a user
            // Pass the current amount so it can be passed back
            router.push({
                pathname: '/user-search',
                params: { amount }
            });
            return;
        }

        setLoading(true);
        try {
            const response = await sendMoney({
                toWalletId: selectedUser.walletId,
                amount: parseFloat(amount),
                description: 'Transfer'
            });

            if (response.success) {
                setShowSuccessModal(true);
            } else {
                Alert.alert('Error', response.message || 'Transaction failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
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
                <Text style={styles.headerTitle}>Send Money</Text>
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Amount Input Card */}
                <Animated.View
                    style={[
                        styles.amountCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <Text style={styles.amountLabel}>Enter Amount</Text>
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType="numeric"
                            style={styles.amountInput}
                        />
                    </View>
                </Animated.View>

                {/* Quick Amounts */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.quickAmountLabel}>Quick Amount</Text>
                    <View style={styles.quickAmountsContainer}>
                        {quickAmounts.map((amt) => (
                            <TouchableOpacity
                                key={amt}
                                style={[
                                    styles.quickAmountChip,
                                    amount === amt && styles.quickAmountChipActive
                                ]}
                                onPress={() => setAmount(amt)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.quickAmountText,
                                    amount === amt && styles.quickAmountTextActive
                                ]}>${amt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Recipient Section */}
                {selectedUser && (
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Send To</Text>
                            <TouchableOpacity onPress={() => setSelectedUser(null)}>
                                <Text style={styles.changeText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.recipientCard}>
                            <View style={styles.methodLeft}>
                                <View style={styles.recipientAvatar}>
                                    <Text style={styles.avatarText}>{selectedUser.name.charAt(0).toUpperCase()}</Text>
                                </View>
                                <View style={styles.recipientInfo}>
                                    <Text style={styles.recipientName}>{selectedUser.name}</Text>
                                    <View style={styles.phoneRow}>
                                        <Ionicons name="call-outline" size={14} color="rgba(255,255,255,0.5)" />
                                        <Text style={styles.recipientPhone}>{selectedUser.phone}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.checkmarkBadge}>
                                <Ionicons name="checkmark" size={16} color="white" />
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* Transfer Button */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleTransfer}
                        disabled={loading}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.confirmButtonGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.confirmButtonText}>
                                        {selectedUser ? 'Confirm Transfer' : 'Select Recipient'}
                                    </Text>
                                    <Ionicons
                                        name={selectedUser ? "paper-plane" : "arrow-forward"}
                                        size={20}
                                        color="white"
                                        style={{ marginLeft: 8 }}
                                    />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={80} color="#4ADE80" />
                        </View>
                        <Text style={styles.successTitle}>Transfer Successful!</Text>
                        <Text style={styles.successAmount}>${parseFloat(amount || '0').toFixed(2)}</Text>
                        <Text style={styles.successRecipient}>to {selectedUser?.name}</Text>
                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => {
                                setShowSuccessModal(false);
                                setAmount('');
                                setSelectedUser(null);
                            }}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    amountCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 32,
        marginTop: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 40,
        color: '#A78BFA',
        fontWeight: 'bold',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 48,
        color: 'white',
        fontWeight: 'bold',
        minWidth: 120,
        textAlign: 'center',
    },
    quickAmountLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    quickAmountsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    quickAmountChip: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    quickAmountChipActive: {
        backgroundColor: 'rgba(167, 139, 250, 0.2)',
        borderColor: '#A78BFA',
    },
    quickAmountText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
        fontSize: 16,
    },
    quickAmountTextActive: {
        color: '#A78BFA',
        fontWeight: 'bold',
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
    },
    changeText: {
        fontSize: 14,
        color: '#A78BFA',
        fontWeight: '600',
    },
    recipientCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    recipientAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    recipientInfo: {
        flex: 1,
    },
    recipientName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    recipientPhone: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
    },
    checkmarkBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4ADE80',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButton: {
        borderRadius: 25,
        marginBottom: 32,
        shadowColor: '#A78BFA',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    confirmButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 25,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E2238', // Fallback
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        width: '85%',
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    successIcon: {
        marginBottom: 24,
        shadowColor: '#4ADE80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
        textAlign: 'center',
    },
    successAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#4ADE80',
        marginBottom: 8,
    },
    successRecipient: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 32,
    },
    doneButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 60,
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    doneButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
