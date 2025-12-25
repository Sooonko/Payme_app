// TODO: TOP UP API INTEGRATION
// Currently using mock success for testing - see handleTopUp function (line ~32)
// Remove mock and uncomment API calls when backend is ready

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Animated, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SuccessModal from '../components/SuccessModal';
import { confirmTopUp, initiateTopUp, TopUpResponse } from '../src/api/client';

export default function TopUp() {
    const { t } = useTranslation();
    const router = useRouter();
    const [amount, setAmount] = useState('0');
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<TopUpResponse['data'] | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successAmount, setSuccessAmount] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const quickAmounts = ['10000', '20000', '50000', '100000'];

    const formatAmount = (val: string) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        if (!cleanVal) return '0';
        const num = parseInt(cleanVal);
        if (num > 5000000) return '5,000,000';
        return num.toLocaleString();
    };

    const handleAmountChange = (val: string) => {
        setAmount(formatAmount(val));
    };

    const getRawAmount = () => {
        return parseFloat(amount.replace(/,/g, '')) || 0;
    };

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
        const rawAmount = getRawAmount();
        if (rawAmount <= 0) {
            Alert.alert(t('wallet.errors.invalidAmount'), t('wallet.errors.enterValidAmount'));
            return;
        }

        setLoading(true);
        try {
            const response = await initiateTopUp(rawAmount);

            if (response.success) {
                setTransaction(response.data);
            } else {
                Alert.alert(t('common.error'), response.message || 'Top-up initiation failed');
            }
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
            // Attempt real confirmation but proceed to success regardless of response for testing
            const response = await confirmTopUp(transaction.transactionId);

            // Set success state regardless of response.success
            setSuccessAmount(transaction.amount);
            setShowSuccessModal(true);

            if (!response.success) {
                console.warn('Top-up confirmation API failed but proceeding to success UI as requested:', response.message);
            }
        } catch (error) {
            console.warn('Top-up confirmation network error but proceeding to success UI as requested');
            // Still show success even on network error
            setSuccessAmount(transaction.amount);
            setShowSuccessModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        setTransaction(null);
        setAmount('');
        router.push('/home');
    };

    return (
        <LinearGradient
            colors={['#1a1642', '#221a52', '#311a63', '#421a52', '#4a1a4a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Background Glows */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: '#4F46E5', width: 400, height: 400, opacity: 0.18 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: '#4f7abdff', width: 350, height: 350, opacity: 0.15 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: '#ae4479ff', width: 380, height: 380, opacity: 0.18 }]} />
            </View>

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

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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
                            <BlurView intensity={20} tint="light" style={styles.amountCardBlur}>
                                <Text style={styles.amountLabel}>{t('topup.confirmation.amount')}</Text>
                                <View style={styles.amountContainer}>
                                    <View style={styles.currencyIconBox}>
                                        <Text style={styles.currencySymbol}>₮</Text>
                                    </View>
                                    <TextInput
                                        value={amount}
                                        onChangeText={handleAmountChange}
                                        placeholder="0"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        keyboardType="numeric"
                                        style={styles.amountInput}
                                        selectionColor="#A78BFA"
                                    />
                                </View>
                                <View style={styles.focusLine} />
                            </BlurView>
                        </Animated.View>

                        {/* Quick Amounts */}
                        <Animated.View
                            style={[
                                styles.quickAmountsWrapper,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                }
                            ]}
                        >
                            <View style={styles.quickAmountsContainer}>
                                {quickAmounts.map((amt) => {
                                    const formattedAmt = parseInt(amt).toLocaleString();
                                    const isActive = amount === formattedAmt;
                                    return (
                                        <TouchableOpacity
                                            key={amt}
                                            style={[
                                                styles.quickAmountChip,
                                                isActive && styles.quickAmountChipActive
                                            ]}
                                            onPress={() => setAmount(formattedAmt)}
                                            activeOpacity={0.7}
                                        >
                                            {isActive ? (
                                                <LinearGradient
                                                    colors={['#A78BFA', '#8B5CF6']}
                                                    style={styles.quickAmountGradient}
                                                >
                                                    <Text style={styles.quickAmountTextActive}>₮{formattedAmt}</Text>
                                                </LinearGradient>
                                            ) : (
                                                <Text style={styles.quickAmountText}>₮{formattedAmt}</Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
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
                                <BlurView intensity={15} tint="light" style={styles.methodBlur}>
                                    <View style={styles.methodLeft}>
                                        <LinearGradient
                                            colors={['#A78BFA', '#8B5CF6']}
                                            style={styles.methodIconContainer}
                                        >
                                            <Ionicons name="card" size={24} color="white" />
                                        </LinearGradient>
                                        <View style={styles.methodInfo}>
                                            <Text style={styles.methodTitle}>{t('topup.methods.bankCard')}</Text>
                                            <Text style={styles.methodSubtitle}>VISA Platinum •••• 4567</Text>
                                        </View>
                                    </View>
                                    <View style={styles.methodAction}>
                                        <Ionicons name="swap-horizontal" size={20} color="rgba(255,255,255,0.6)" />
                                    </View>
                                </BlurView>
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
                                style={styles.mainButtonWrapper}
                            >
                                <LinearGradient
                                    colors={['#A78BFA', '#7C3AED']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.confirmButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text style={styles.confirmButtonText}>{t('topup.button.confirm')}</Text>
                                            <View style={styles.buttonIconBox}>
                                                <Ionicons name="arrow-forward" size={18} color="white" />
                                            </View>
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
                                <Ionicons name="shield-checkmark" size={32} color="#10B981" />
                            </View>
                            <Text style={styles.confirmHeaderText}>{t('topup.confirmation.ready')}</Text>
                            <Text style={styles.confirmSubtext}>{t('topup.confirmation.scan')}</Text>
                        </View>

                        {/* QR Code Card */}
                        <View style={styles.qrCard}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
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
                                            <Ionicons name="qr-code" size={80} color="rgba(167, 139, 250, 0.3)" />
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
                                <Text style={styles.detailAmount}>₮{transaction.amount.toLocaleString()}</Text>
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
                            style={styles.mainButtonWrapper}
                        >
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.confirmButton}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text style={styles.confirmButtonText}>{t('topup.button.confirmPayment')}</Text>
                                        <View style={styles.buttonIconBox}>
                                            <Ionicons name="checkmark" size={18} color="white" />
                                        </View>
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
    glow: {
        position: 'absolute',
        borderRadius: 200,
        filter: 'blur(80px)',
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: 'white',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    amountCard: {
        marginTop: 10,
        marginBottom: 24,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    amountCardBlur: {
        padding: 30,
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 15,
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    currencyIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    currencySymbol: {
        fontSize: 24,
        color: '#A78BFA',
        fontWeight: 'bold',
    },
    amountInput: {
        fontSize: 48,
        color: 'white',
        fontWeight: 'bold',
        minWidth: 150,
        textAlign: 'center',
        letterSpacing: 1,
    },
    focusLine: {
        width: 60,
        height: 4,
        backgroundColor: '#A78BFA',
        borderRadius: 2,
        marginTop: 15,
        opacity: 0.8,
    },
    quickAmountsWrapper: {
        marginBottom: 32,
    },
    quickAmountsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    quickAmountChip: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 18,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        overflow: 'hidden',
    },
    quickAmountChipActive: {
        borderColor: '#A78BFA',
        backgroundColor: 'transparent',
    },
    quickAmountGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickAmountText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        fontSize: 16,
    },
    quickAmountTextActive: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: 'white',
        letterSpacing: 0.5,
    },
    paymentMethodCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        marginBottom: 35,
    },
    methodBlur: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    methodIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    methodInfo: {
        flex: 1,
    },
    methodTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
    },
    methodSubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '500',
    },
    methodAction: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainButtonWrapper: {
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    confirmButton: {
        flexDirection: 'row',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    buttonIconBox: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationContainer: {
        alignItems: 'stretch',
        marginTop: 10,
    },
    confirmHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    successIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    confirmHeaderText: {
        fontSize: 26,
        fontWeight: '800',
        color: 'white',
        marginBottom: 10,
    },
    confirmSubtext: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        lineHeight: 22,
    },
    qrCard: {
        borderRadius: 30,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    qrCardGradient: {
        padding: 25,
        alignItems: 'center',
    },
    qrContainer: {
        width: 240,
        height: 240,
        backgroundColor: 'white',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        padding: 20,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    qrCode: {
        width: '100%',
        height: '100%',
    },
    placeholderQr: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        color: 'rgba(30,34,56,0.5)',
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
    },
    qrLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    detailsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    detailLabel: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '500',
    },
    detailAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 6,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 14,
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#A78BFA',
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    statusText: {
        fontSize: 14,
        color: '#A78BFA',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    helpText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
        lineHeight: 20,
    },
});
