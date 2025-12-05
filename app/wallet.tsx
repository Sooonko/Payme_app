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
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Money</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Amount Input */}
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

                {/* Quick Amounts */}
                <View style={styles.quickAmountsContainer}>
                    {quickAmounts.map((amt) => (
                        <TouchableOpacity
                            key={amt}
                            style={styles.quickAmountChip}
                            onPress={() => setAmount(amt)}
                        >
                            <Text style={styles.quickAmountText}>${amt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recipient Section (Only show if user selected, otherwise show 'Select Recipient' placeholder or nothing until next step) */}
                {/* User flow: Enter Amount -> Next -> Search. So initially we don't show recipient. 
                    But if they come back from search, we show recipient. */}
                {selectedUser && (
                    <>
                        <Text style={styles.sectionTitle}>Recipient</Text>
                        <View style={styles.methodCard}>
                            <View style={styles.methodLeft}>
                                <View style={styles.methodIcon}>
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{selectedUser.name.charAt(0)}</Text>
                                </View>
                                <View>
                                    <Text style={styles.methodTitle}>{selectedUser.name}</Text>
                                    <Text style={styles.methodSubtitle}>{selectedUser.phone}</Text>
                                </View>
                            </View>
                            <Ionicons name="checkmark-circle" size={24} color="#A78BFA" />
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
                        <Text style={styles.confirmButtonText}>
                            {selectedUser ? 'Confirm Transfer' : 'Next'}
                        </Text>
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
        justifyContent: 'space-between',
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
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    currencySymbol: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 48,
        color: 'white',
        fontWeight: 'bold',
        minWidth: 100,
        textAlign: 'center',
    },
    quickAmountsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    quickAmountChip: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    quickAmountText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    methodCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#A78BFA',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(167, 139, 250, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    methodTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    methodSubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
    confirmButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 25,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 32,
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
