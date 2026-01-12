import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ActiveLoan, applyForLoan, checkLoanEligibility, disburseLoan, getLoanProducts, getMyLoans, LoanApplication, LoanProduct, repayLoan } from '../src/api/client';
import { useTheme } from '../src/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function Loan() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;



    // State
    const [loans, setLoans] = useState<ActiveLoan[]>([]);
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [bannerIndex, setBannerIndex] = useState(0);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
    const [requestedAmount, setRequestedAmount] = useState('');
    const [requestedTerm, setRequestedTerm] = useState('12');
    const [checkingProductId, setCheckingProductId] = useState<string | null>(null);

    // Approved State
    const [application, setApplication] = useState<LoanApplication | null>(null);

    // Repay Modal State
    const [showRepayModal, setShowRepayModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<ActiveLoan | null>(null);
    const [repayAmount, setRepayAmount] = useState('');

    useFocusEffect(
        useCallback(() => {
            fetchLoans();
            fetchProducts();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }, [])
    );

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getLoanProducts();
            if (response.success && response.data) {
                setLoanProducts(response.data);
            }
        } catch (error) {
            console.error('Fetch loan products error:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkEligibility = async (productId: string) => {
        setCheckingProductId(productId);
        try {
            const response = await checkLoanEligibility(productId);
            if (response.success && response.data) {
                Alert.alert(t('loan.alerts.success'), response.data.message || t('loan.alerts.checkSuccess'));
                // Refresh products to get updated checked status
                await fetchProducts();
            } else {
                Alert.alert(t('loan.alerts.error'), response.message);
            }
        } catch (error) {
            console.error('Check eligibility error:', error);
            Alert.alert(t('loan.alerts.error'), t('loan.alerts.checkError'));
        } finally {
            setCheckingProductId(null);
        }
    };

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const response = await getMyLoans();
            if (response.success) {
                setLoans(response.data);
            }
        } catch (error) {
            console.error('Fetch loans error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!selectedProduct) return;
        const amount = parseFloat(requestedAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert(t('loan.alerts.error'), t('loan.alerts.invalidAmount'));
            return;
        }

        setActionLoading(true);
        try {
            const response = await applyForLoan({
                productId: selectedProduct.productId,
                requestedAmount: amount,
                tenorMonths: parseInt(requestedTerm),
            });

            if (response.success) {
                if (response.data.status === 'APPROVED') {
                    // Loan is already approved and disbursed
                    Alert.alert(t('loan.alerts.success'), response.data.message || t('loan.alerts.applySuccess'));
                    setShowApplyModal(false);
                    setApplication(null);
                    setApplication(null);
                    fetchLoans(); // Refresh active loans
                    fetchProducts(); // Refresh eligibility
                } else {
                    // Still requires manual disbursement (e.g. if status is PENDING/ready for disbursement)
                    setApplication(response.data);
                }
            } else {
                Alert.alert(t('loan.alerts.error'), response.message);
            }
        } catch (error) {
            console.error('Apply error:', error);
            Alert.alert(t('loan.alerts.error'), t('loan.alerts.applyError'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisburse = async () => {
        if (!application) return;

        setActionLoading(true);
        try {
            const response = await disburseLoan(application.applicationId);
            if (response.success) {
                Alert.alert(t('loan.alerts.success'), t('loan.alerts.applySuccess'));
                setShowApplyModal(false);
                setApplication(null);
                setApplication(null);
                fetchLoans();
                fetchProducts();
            } else {
                Alert.alert(t('loan.alerts.error'), response.message);
            }
        } catch (error) {
            Alert.alert(t('loan.alerts.error'), t('loan.alerts.applyError'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleRepay = async () => {
        if (!selectedLoan) return;
        const amount = parseFloat(repayAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert(t('loan.alerts.error'), t('loan.alerts.invalidAmount'));
            return;
        }

        setActionLoading(true);
        try {
            const response = await repayLoan({
                loanId: selectedLoan.id,
                amount: amount,
            });

            if (response.success) {
                Alert.alert(t('loan.alerts.success'), t('loan.alerts.repaySuccess'));
                setShowRepayModal(false);
                setSelectedLoan(null);
                setRepayAmount('');
                fetchLoans();
            } else {
                Alert.alert(t('loan.alerts.error'), response.message);
            }
        } catch (error) {
            Alert.alert(t('loan.alerts.error'), t('loan.alerts.repayError'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
        setBannerIndex(index);
    };

    const renderLoanCard = (item: LoanProduct) => (
        <BlurView intensity={isDark ? 25 : 60} tint={isDark ? "light" : "default"} style={[styles.card, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.productName}</Text>

            <View style={styles.infoRow}>
                <View style={styles.durationRow}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.durationText, { color: colors.textSecondary }]}>{item.minTenorMonths}-{item.maxTenorMonths} {t('loan.product.months')}</Text>
                </View>
                <View style={styles.interestRow}>
                    <Ionicons name="trending-up-outline" size={14} color="#10B981" />
                    <Text style={styles.interestText}>{item.interestRateMonthly}%</Text>
                </View>
            </View>

            <Text style={[styles.amountLabel, { color: isDark ? '#34D399' : '#059669' }]}>
                {item.checked ? t('loan.product.eligibleAmount') : t('loan.product.checkEligibility')}
            </Text>
            <Text style={[styles.amountText, { color: colors.text }]}>
                {item.checked ? `${item.maxEligibleAmount.toLocaleString()}₮` : '-'}
            </Text>

            <TouchableOpacity
                style={[styles.actionButton, { opacity: item.checked ? 1 : 0.5 }]}
                onPress={() => {
                    setSelectedProduct(item);
                    setRequestedAmount(item.minAmount.toString());
                    setRequestedTerm(item.minTenorMonths.toString());
                    setShowApplyModal(true);
                }}
                disabled={!item.checked}
            >
                <Text style={styles.actionButtonText}>{t('loan.product.apply')}</Text>
            </TouchableOpacity>
        </BlurView>
    );

    const renderActiveLoanCard = (loan: ActiveLoan) => (
        <BlurView intensity={isDark ? 35 : 70} tint={isDark ? "light" : "default"} style={[styles.activeLoanCard, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
            <View style={styles.activeHeader}>
                <View>
                    <Text style={[styles.activeLabel, { color: colors.textSecondary }]}>{t('loan.active.remainingBalance')}</Text>
                    <Text style={[styles.activeAmount, { color: colors.text }]}>₮{loan.remainingBalance.toLocaleString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: loan.status === 'ACTIVE' ? '#10B98120' : '#EF444420' }]}>
                    <Text style={[styles.statusText, { color: loan.status === 'ACTIVE' ? '#10B981' : '#EF4444' }]}>{t(`loan.active.status.${loan.status}`)}</Text>
                </View>
            </View>

            <View style={styles.loanDetailsRow}>
                <View>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('loan.active.totalAmount')}</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>₮{loan.principalAmount.toLocaleString()}</Text>
                </View>
                <View>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('loan.active.endDate')}</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{new Date(loan.endDate).toLocaleDateString()}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.repayButton}
                onPress={() => {
                    setSelectedLoan(loan);
                    setShowRepayModal(true);
                }}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.repayButtonGradient}
                >
                    <Text style={styles.repayButtonText}>{t('loan.active.repay')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </BlurView>
    );

    return (
        <LinearGradient
            colors={colors.backgroundGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: colors.glows[0], width: 400, height: 400, opacity: isDark ? 0.18 : 0.25 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: colors.glows[1], width: 350, height: 350, opacity: isDark ? 0.15 : 0.2 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: colors.glows[2], width: 380, height: 380, opacity: isDark ? 0.18 : 0.25 }]} />
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('loan.title')}</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Active Loans Section */}
                    {loans.length > 0 && (
                        <View style={styles.activeSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('loan.myLoans')}</Text>
                            {loans.map((loan) => (
                                <View key={loan.id} style={{ marginBottom: 15 }}>
                                    {renderActiveLoanCard(loan)}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Banner Section */}
                    {loanProducts.length > 0 && (
                        <View style={styles.bannerWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.bannerContainer}
                                style={styles.bannerScroll}
                                pagingEnabled
                                decelerationRate="fast"
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                            >
                                {loanProducts.map((item, idx) => (
                                    <BlurView key={item.productId} intensity={isDark ? 25 : 80} tint={isDark ? "light" : "default"} style={[styles.bannerItem, { borderColor: colors.glassBorder }]}>
                                        <Image
                                            source={{ uri: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop" }}
                                            style={[StyleSheet.absoluteFillObject, { opacity: isDark ? 0.6 : 0.8 }]}
                                            contentFit="cover"
                                        />
                                        <View style={styles.bannerOverlay} />
                                        <View style={styles.bannerContent}>
                                            <View style={styles.bannerTextContainer}>
                                                <Text style={styles.bannerTitle}>{item.productName}</Text>
                                                <View style={styles.bannerLimitContainer}>
                                                    <Text style={styles.bannerLimitLabel}>Хэмжээ:</Text>
                                                    <Text style={styles.bannerLimitValue}>
                                                        {item.minAmount.toLocaleString()}₮ - {item.maxAmount.toLocaleString()}₮
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                style={[styles.bannerButton, {
                                                    backgroundColor: item.checked ? 'rgba(167, 139, 250, 0.5)' : colors.tint,
                                                    opacity: item.checked ? 0.6 : 1
                                                }]}
                                                onPress={() => checkEligibility(item.productId)}
                                                disabled={checkingProductId === item.productId || item.checked}
                                            >
                                                {checkingProductId === item.productId ? (
                                                    <ActivityIndicator size="small" color="white" />
                                                ) : (
                                                    <Text style={styles.bannerButtonText}>
                                                        {item.checked ? t('loan.product.checked') : t('loan.product.check')}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </BlurView>
                                ))}
                            </ScrollView>

                            <View style={styles.paginationContainer}>
                                {loanProducts.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.paginationDot,
                                            index === bannerIndex && styles.paginationDotActive
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    )}

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('loan.products')}</Text>
                    <View style={styles.grid}>
                        {loanProducts.map((item) => (
                            <View key={item.productId} style={styles.cardWrapper}>
                                {renderLoanCard(item)}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Animated.View>

            {/* Apply Loan Modal */}
            <Modal visible={showApplyModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={[styles.modalContent, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedProduct?.productName}</Text>
                            <TouchableOpacity onPress={() => { setShowApplyModal(false); setApplication(null); }}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        {!application ? (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>{t('loan.modal.amount')}</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={requestedAmount}
                                        onChangeText={setRequestedAmount}
                                        placeholder="0"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>{t('loan.modal.term')}</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={requestedTerm}
                                        onChangeText={setRequestedTerm}
                                        placeholder="12"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: colors.tint }]}
                                    onPress={handleApply}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalButtonText}>{t('loan.modal.submit')}</Text>}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.resultContainer}>
                                <View style={styles.successIcon}>
                                    <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                                </View>
                                <Text style={[styles.resultTitle, { color: colors.text }]}>{t('loan.modal.successTitle')}</Text>
                                <View style={[styles.resultDetails, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}>
                                    <View style={styles.resultRow}>
                                        <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>{t('loan.modal.approvedAmount')}:</Text>
                                        <Text style={[styles.resultValue, { color: colors.text }]}>₮{application.maxEligibleAmount.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>{t('loan.modal.term')}:</Text>
                                        <Text style={[styles.resultValue, { color: colors.text }]}>{application.tenorMonths} {t('loan.product.months')}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#10B981' }]}
                                    onPress={handleDisburse}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalButtonText}>{t('loan.modal.getLoan')}</Text>}
                                </TouchableOpacity>
                            </View>
                        )}
                    </BlurView>
                </View>
            </Modal>

            {/* Repay Modal */}
            <Modal visible={showRepayModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={[styles.modalContent, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('loan.modal.repayTitle')}</Text>
                            <TouchableOpacity onPress={() => setShowRepayModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('loan.modal.repayAmount')}</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={repayAmount}
                                onChangeText={setRepayAmount}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                            />
                            <Text style={styles.balanceInfo}>{t('loan.modal.balance')}: ₮{selectedLoan?.remainingBalance.toLocaleString()}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#10B981' }]}
                            onPress={handleRepay}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalButtonText}>{t('loan.modal.pay')}</Text>}
                        </TouchableOpacity>
                    </BlurView>
                </View>
            </Modal>
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
    content: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 110,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        marginTop: 10,
    },
    activeSection: {
        marginBottom: 20,
    },
    activeLoanCard: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    activeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    activeLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4,
    },
    activeAmount: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    loanDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    detailLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: 'white',
        fontWeight: '600',
    },
    repayButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    repayButtonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    repayButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48.5%',
        marginBottom: 15,
    },
    card: {
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
        height: 220,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
        height: 40,
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    durationText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    interestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    interestText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: 'bold',
    },
    amountLabel: {
        fontSize: 12,
        color: '#34D399',
        fontWeight: '600',
        marginBottom: 4,
    },
    amountText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
        opacity: 0.9,
    },
    actionButton: {
        backgroundColor: '#E11D48',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 'auto',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
    },
    bannerWrapper: {
        marginTop: 20,
        marginBottom: 25,
        alignItems: 'center',
    },
    bannerScroll: {
        width: width - 30,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    bannerContainer: {
        paddingHorizontal: 0,
    },
    bannerItem: {
        width: width - 32,
        height: 160,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bannerContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
    },
    bannerTextContainer: {
        width: '100%',
    },
    bannerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    bannerSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        lineHeight: 18,
    },
    bannerButton: {
        backgroundColor: '#A78BFA',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginTop: 12,
    },
    bannerButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    paginationDotActive: {
        width: 20,
        backgroundColor: 'white',
    },
    bannerLimitContainer: {
        marginTop: 4,
    },
    bannerLimitLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    bannerLimitValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    eligibilityMessageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        padding: 15,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.2)',
    },
    eligibilityText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    inputGroup: {
        marginBottom: 25,
    },
    inputLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 10,
    },
    modalInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 15,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    successIcon: {
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    resultDetails: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    resultLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 15,
    },
    resultValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    balanceInfo: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 8,
        textAlign: 'right',
    },
});
