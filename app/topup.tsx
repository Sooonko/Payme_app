// TODO: TOP UP API INTEGRATION
// Currently using mock success for testing - see handleTopUp function (line ~32)
// Remove mock and uncomment API calls when backend is ready

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Animated, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SuccessModal from '../components/SuccessModal';
import { confirmTopUp, TopUpResponse } from '../src/api/client';

export default function TopUp() {
    const { t } = useTranslation();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<TopUpResponse['data'] | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successAmount, setSuccessAmount] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const quickAmounts = ['10', '20', '50', '100'];

    useFocusEffect(
        useCallback(() => {
            setTransaction(null);
            setAmount('');
            setLoading(false);

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

    const handleTopUp = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert(t('wallet.errors.invalidAmount'), t('wallet.errors.enterValidAmount'));
            return;
        }

        setLoading(true);
        try {
            // TODO: Fix API integration - temporarily mocking success
            // Uncomment below when API is ready
            /*
            const response = await initiateTopUp(parseFloat(amount));

            if (response.success) {
                setTransaction(response.data);
            } else {
                Alert.alert(t('common.error'), response.message || 'Top-up initiation failed');
            }
            */

            // TEMPORARY: Mock success for testing
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            const mockAmount = parseFloat(amount);
            setSuccessAmount(mockAmount);
            setShowSuccessModal(true);
            setAmount('');

        } catch (error) {
            Alert.alert(t('common.error'), t('register.errors.network'));
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
                Alert.alert(t('common.error'), response.message || 'Failed to confirm top-up');
            }
        } catch (error) {
            Alert.alert(t('common.error'), t('register.errors.network'));
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
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('topup.title')}</Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {!transaction ? (
                    <>
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
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.amountCardGradient}
                            >

                                <View style={styles.amountContainer}>
                                    <Text style={styles.currencySymbol}>₮</Text>
                                    <TextInput
                                        value={amount}
                                        onChangeText={setAmount}
                                        placeholder="0.00"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        keyboardType="numeric"
                                        style={styles.amountInput}
                                    />
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        {/* Quick Amounts */}
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >

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
                                        {amount === amt ? (
                                            <LinearGradient
                                                colors={['#A78BFA', '#8B5CF6']}
                                                style={styles.quickAmountGradient}
                                            >
                                                <Text style={styles.quickAmountTextActive}>₮{amt}</Text>
                                            </LinearGradient>
                                        ) : (
                                            <Text style={styles.quickAmountText}>₮{amt}</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Animated.View>

                        {/* Payment Method */}
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{t('topup.paymentMethod')}</Text>
                            </View>
                            <TouchableOpacity style={styles.paymentMethodCard} activeOpacity={0.7}>
                                <View style={styles.methodLeft}>
                                    <LinearGradient
                                        colors={['#A78BFA', '#8B5CF6']}
                                        style={styles.methodIconContainer}
                                    >
                                        <Ionicons name="card-outline" size={24} color="white" />
                                    </LinearGradient>
                                    <View style={styles.methodInfo}>
                                        <Text style={styles.methodTitle}>{t('topup.methods.bankCard')}</Text>
                                        <Text style={styles.methodSubtitle}>•••• •••• •••• 1234</Text>
                                    </View>
                                </View>
                                <View style={styles.checkmarkBadge}>
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Initiate Button */}
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleTopUp}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#34D399', '#10B981']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.confirmButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text style={styles.confirmButtonText}>{t('topup.button.confirm')}</Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </>
                ) : (
                    <Animated.View
                        style={[
                            styles.confirmationContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }
                        ]}
                    >
                        {/* Header Section */}
                        <View style={styles.confirmHeader}>
                            <View style={styles.successIconContainer}>
                                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                            </View>
                            <Text style={styles.confirmHeaderText}>{t('topup.confirmation.ready')}</Text>
                            <Text style={styles.confirmSubtext}>{t('topup.confirmation.scan')}</Text>
                        </View>

                        {/* QR Code Card */}
                        <View style={styles.qrCard}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.qrCardGradient}
                            >
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
                                            <Text style={styles.placeholderText}>{t('topup.confirmation.qrUnavailable')}</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.qrLabel}>{t('topup.confirmation.scanToPay')}</Text>
                            </LinearGradient>
                        </View>

                        {/* Transaction Details */}
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{t('topup.confirmation.amount')}</Text>
                                <Text style={styles.detailAmount}>₮{transaction.amount.toFixed(2)}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{t('topup.confirmation.status')}</Text>
                                <View style={styles.statusBadge}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.statusText}>{transaction.status}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            onPress={handleConfirm}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#34D399', '#10B981']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.confirmButton}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text style={styles.confirmButtonText}>{t('topup.button.confirmPayment')}</Text>
                                        <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Help Text */}
                        <Text style={styles.helpText}>
                            {t('topup.confirmation.help')}
                        </Text>
                    </Animated.View>
                )}
            </ScrollView>

            <SuccessModal
                visible={showSuccessModal}
                amount={successAmount}
                onClose={handleSuccessClose}
            />
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
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
        marginTop: 20,
        marginBottom: 24,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    amountCardGradient: {
        padding: 24,
        borderRadius: 24,
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

    quickAmountsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
        gap: 8,
    },
    quickAmountChip: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        overflow: 'hidden',
    },
    quickAmountChipActive: {
        backgroundColor: 'transparent',
        borderColor: '#A78BFA',
        borderWidth: 2,
    },
    quickAmountGradient: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    quickAmountText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
        fontSize: 15,
    },
    quickAmountTextActive: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
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
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
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
        color: 'rgba(255,255,255,0.6)',
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
        borderRadius: 25,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successIconContainer: {
        marginBottom: 16,
    },
    confirmHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    confirmSubtext: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
    },
    qrCard: {
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    qrCardGradient: {
        padding: 20,
        alignItems: 'center',
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
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    detailsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '500',
    },
    detailAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginVertical: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(167, 139, 250, 0.2)',
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
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginTop: 16,
        fontStyle: 'italic',
    },
});
