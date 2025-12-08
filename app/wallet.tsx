import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { sendMoney, UserSearchResponse } from '../src/api/client';

export default function Wallet() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSearchResponse['data'][0] | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const quickAmounts = ['10', '20', '50', '100'];

    useFocusEffect(
        useCallback(() => {
            // If we don't have navigation params (meaning we came from Home or elsewhere, not User Search),
            // we should clear the state to ensure a fresh start.
            if (!params.userId && !params.amount) {
                setSelectedUser(null);
                setAmount('');
            }
        }, [params.userId, params.amount])
    );

    useEffect(() => {
        if (params.amount) {
            setAmount(params.amount as string);
        }
        if (params.userId) {
            setSelectedUser({
                userId: params.userId as string,
                name: params.name as string,
                phone: params.phone as string,
                walletId: params.walletId as string
            });
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Send Money</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Amount Input Card */}
                <View style={styles.amountCard}>
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
                </View>

                {/* Quick Amounts */}
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
                        >
                            <Text style={[
                                styles.quickAmountText,
                                amount === amt && styles.quickAmountTextActive
                            ]}>${amt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recipient Section */}
                {selectedUser && (
                    <>
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
                    </>
                )}

                {/* Transfer Button */}
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleTransfer}
                    disabled={loading}
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
                </TouchableOpacity>
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
                                router.push('/home');
                            }}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        fontSize: 28,
        color: 'white',
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
    amountCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 24,
        padding: 24,
        marginTop: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.2)',
    },
    amountLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
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
        fontSize: 36,
        color: '#A78BFA',
        fontWeight: 'bold',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 44,
        color: 'white',
        fontWeight: 'bold',
        minWidth: 120,
        textAlign: 'center',
    },
    quickAmountLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    quickAmountsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
        gap: 8,
    },
    quickAmountChip: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.2)',
        alignItems: 'center',
    },
    quickAmountChipActive: {
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        borderColor: '#A78BFA',
    },
    quickAmountText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        fontSize: 15,
    },
    quickAmountTextActive: {
        color: '#A78BFA',
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
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
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.2)',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    recipientAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    recipientInfo: {
        flex: 1,
    },
    recipientName: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 6,
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
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButton: {
        flexDirection: 'row',
        backgroundColor: '#A78BFA',
        borderRadius: 25,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#A78BFA',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E2238',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        width: '85%',
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    successIcon: {
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    successAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4ADE80',
        marginBottom: 8,
    },
    successRecipient: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 32,
    },
    doneButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 60,
    },
    doneButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
