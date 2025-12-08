import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SuccessModal from '../components/SuccessModal';
import { confirmTopUp, initiateTopUp, TopUpResponse } from '../src/api/client';

export default function TopUp() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<TopUpResponse['data'] | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successAmount, setSuccessAmount] = useState(0);

    const quickAmounts = ['10', '20', '50', '100'];

    useFocusEffect(
        useCallback(() => {
            setTransaction(null);
            setAmount('');
            setLoading(false);
        }, [])
    );

    const handleTopUp = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount to top up.');
            return;
        }

        setLoading(true);
        try {
            const response = await initiateTopUp(parseFloat(amount));
            if (response.success) {
                setTransaction(response.data);
            } else {
                Alert.alert('Error', response.message || 'Failed to initiate top-up');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!transaction) return;

        setLoading(true);
        try {
            const response = await confirmTopUp(transaction.transactionId);
            if (response.success) {
                setSuccessAmount(transaction.amount);
                setShowSuccessModal(true);
            } else {
                Alert.alert('Error', response.message || 'Failed to confirm top-up');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        setTransaction(null);
        setAmount('');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Top Up</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {!transaction ? (
                    <>
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

                        {/* Payment Method */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Payment Method</Text>
                        </View>
                        <TouchableOpacity style={styles.paymentMethodCard}>
                            <View style={styles.methodLeft}>
                                <View style={styles.methodIconContainer}>
                                    <Ionicons name="card-outline" size={24} color="#A78BFA" />
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodTitle}>Bank Card</Text>
                                    <Text style={styles.methodSubtitle}>**** **** **** 1234</Text>
                                </View>
                            </View>
                            <View style={styles.checkmarkBadge}>
                                <Ionicons name="checkmark" size={16} color="white" />
                            </View>
                        </TouchableOpacity>

                        {/* Initiate Button */}
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleTopUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.confirmButtonText}>Confirm Top Up</Text>
                                    <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.confirmationContainer}>
                        {/* Header Section */}
                        <View style={styles.confirmHeader}>
                            <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                            <Text style={styles.confirmHeaderText}>Ready to Complete</Text>
                        </View>

                        {/* QR Code Card */}
                        <View style={styles.qrCard}>
                            <View style={styles.qrContainer}>
                                {transaction.qrCode ? (
                                    <Image
                                        source={{ uri: transaction.qrCode }}
                                        style={styles.qrCode}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View style={styles.placeholderQr}>
                                        <Ionicons name="qr-code-outline" size={100} color="rgba(167, 139, 250, 0.4)" />
                                        <Text style={styles.placeholderText}>QR Code not available</Text>
                                    </View>
                                )}
                            </View>

                            {/* QR Code Label */}
                            <Text style={styles.qrLabel}>Scan to Pay</Text>
                        </View>

                        {/* Transaction Details */}
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Amount</Text>
                                <Text style={styles.detailAmount}>${transaction.amount.toFixed(2)}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Status</Text>
                                <View style={styles.statusBadge}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.statusText}>{transaction.status}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.confirmButtonText}>Confirm Payment</Text>
                                    <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Help Text */}
                        <Text style={styles.helpText}>
                            Click confirm after scanning the QR code or making payment
                        </Text>
                    </View>
                )}
            </ScrollView>

            <SuccessModal
                visible={showSuccessModal}
                amount={successAmount}
                onClose={handleSuccessClose}
            />
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
    paymentMethodCard: {
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
    methodIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    methodInfo: {
        flex: 1,
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
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    confirmationContainer: {
        alignItems: 'stretch',
        marginTop: 12,
        paddingHorizontal: 4,
    },
    confirmHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
    },
    confirmHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    qrCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.2)',
    },
    qrContainer: {
        width: 220,
        height: 220,
        backgroundColor: 'white',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#A78BFA',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    qrCode: {
        width: '100%',
        height: '100%',
    },
    placeholderQr: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(30, 34, 56, 0.4)',
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        color: 'rgba(167, 139, 250, 0.5)',
        marginTop: 12,
        fontSize: 13,
    },
    qrLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    detailsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.15)',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '500',
    },
    detailAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        marginVertical: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#A78BFA',
    },
    statusText: {
        fontSize: 13,
        color: '#A78BFA',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    helpText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: 16,
        fontStyle: 'italic',
    },
});
