import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { confirmTopUp, initiateTopUp, TopUpResponse } from '../src/api/client';

export default function TopUp() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<TopUpResponse['data'] | null>(null);

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
                Alert.alert(
                    'Success',
                    'Top-up completed successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setTransaction(null);
                                setAmount('');
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Error', response.message || 'Failed to confirm top-up');
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
                <Text style={styles.headerTitle}>Top Up</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {!transaction ? (
                    <>
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

                        {/* Payment Method */}
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        <TouchableOpacity style={styles.methodCard}>
                            <View style={styles.methodLeft}>
                                <View style={styles.methodIcon}>
                                    <Ionicons name="card-outline" size={24} color="white" />
                                </View>
                                <View>
                                    <Text style={styles.methodTitle}>Bank Card</Text>
                                    <Text style={styles.methodSubtitle}>**** **** **** 1234</Text>
                                </View>
                            </View>
                            <Ionicons name="checkmark-circle" size={24} color="#A78BFA" />
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
                                <Text style={styles.confirmButtonText}>Confirm Top Up</Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.confirmationContainer}>
                        <View style={styles.qrContainer}>
                            {transaction.qrCode ? (
                                <Image
                                    source={{ uri: transaction.qrCode }}
                                    style={styles.qrCode}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={styles.placeholderQr}>
                                    <Ionicons name="qr-code-outline" size={100} color="white" />
                                    <Text style={styles.placeholderText}>QR Code not available</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.confirmAmount}>${transaction.amount.toFixed(2)}</Text>
                        <Text style={styles.confirmStatus}>Status: {transaction.status}</Text>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.confirmButtonText}>Confirm Payment</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
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
    confirmationContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    qrContainer: {
        width: 250,
        height: 250,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },
    qrCode: {
        width: '100%',
        height: '100%',
    },
    placeholderQr: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        color: 'rgba(255,255,255,0.5)',
        marginTop: 12,
    },
    confirmAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    confirmStatus: {
        fontSize: 16,
        color: '#A78BFA',
        marginBottom: 32,
        fontWeight: 'bold',
    },
});
