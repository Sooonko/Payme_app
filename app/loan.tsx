import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ActiveLoan, applyForLoan, disburseLoan, getMyLoans, LoanApplication, repayLoan } from '../src/api/client';

const { width, height } = Dimensions.get('window');

interface LoanProductUI {
    id: string;
    title: string;
    duration: string;
    amount: string;
    buttonText: string;
    productId: string; // Real UUID for API
}

const LOAN_DATA: LoanProductUI[] = [
    { id: '1', title: 'Богино хугацаат', duration: '-', amount: '10,000,000₮ хүртэл', buttonText: 'Зээл авах', productId: 'p1p2p3p4-p5p6-p7p8-p9p0-p1p2p3p4p5p6' },
    { id: '2', title: 'Урт хугацаат', duration: '3-18 сар', amount: '35,000,000₮ хүртэл', buttonText: 'Зээл авах', productId: 'p1p2p3p4-p5p6-p7p8-p9p0-p1p2p3p4p5p7' },
    { id: '5', title: 'Автомашины зээл', duration: '6-36 сар', amount: '35,000,000₮ хүртэл', buttonText: 'Зээл авах', productId: 'p1p2p3p4-p5p6-p7p8-p9p0-p1p2p3p4p5p8' },
    { id: '6', title: 'Итгэлцэл барьцаалсан зээл', duration: '-', amount: '120,000,000₮ хүртэл', buttonText: 'Зээл авах', productId: 'p1p2p3p4-p5p6-p7p8-p9p0-p1p2p3p4p5p9' },
];

const BANNER_DATA = [
    { id: 1, title: "Зээлийн эрхээ нэмээрэй", subtitle: "Таны зээлийн эрх 10,000,000₮ хүртэл нэмэгдэх боломжтой.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Шуурхай зээл", subtitle: "5 минутын дотор зээлээ аваарай.", image: "https://images.unsplash.com/photo-1579621970795-87f967b16cf8?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Ухаалаг санхүү", subtitle: "Бага хүүтэй, уян хатан нөхцөлтэй зээлүүд.", image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=800&auto=format&fit=crop" }
];

export default function Loan() {
    const { t } = useTranslation();
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // State
    const [loans, setLoans] = useState<ActiveLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [bannerIndex, setBannerIndex] = useState(0);

    // Apply Modal State
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<LoanProductUI | null>(null);
    const [requestedAmount, setRequestedAmount] = useState('');
    const [requestedTerm, setRequestedTerm] = useState('12');

    // Approved State
    const [application, setApplication] = useState<LoanApplication | null>(null);

    // Repay Modal State
    const [showRepayModal, setShowRepayModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<ActiveLoan | null>(null);
    const [repayAmount, setRepayAmount] = useState('');

    useEffect(() => {
        fetchLoans();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

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
            Alert.alert('Алдаа', 'Зээлийн дүнг зөв оруулна уу');
            return;
        }

        setActionLoading(true);
        try {
            const response = await applyForLoan({
                productId: selectedProduct.productId,
                requestedAmount: amount,
                requestedTermMonths: parseInt(requestedTerm),
            });

            if (response.success) {
                setApplication(response.data);
            } else {
                Alert.alert('Алдаа', response.message);
            }
        } catch (error) {
            Alert.alert('Алдаа', 'Зээлийн хүсэлт илгээхэд алдаа гарлаа');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisburse = async () => {
        if (!application) return;

        setActionLoading(true);
        try {
            const response = await disburseLoan(application.id);
            if (response.success) {
                Alert.alert('Амжилттай', 'Зээл олгогдлоо. Таны хэтэвчинд мөнгө орсон байна.');
                setShowApplyModal(false);
                setApplication(null);
                fetchLoans();
            } else {
                Alert.alert('Алдаа', response.message);
            }
        } catch (error) {
            Alert.alert('Алдаа', 'Зээл олгоход алдаа гарлаа');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRepay = async () => {
        if (!selectedLoan) return;
        const amount = parseFloat(repayAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Алдаа', 'Төлөх дүнг зөв оруулна уу');
            return;
        }

        setActionLoading(true);
        try {
            const response = await repayLoan({
                loanId: selectedLoan.id,
                amount: amount,
            });

            if (response.success) {
                Alert.alert('Амжилттай', 'Зээлийн төлөлт амжилттай хийгдлээ');
                setShowRepayModal(false);
                setSelectedLoan(null);
                setRepayAmount('');
                fetchLoans();
            } else {
                Alert.alert('Алдаа', response.message);
            }
        } catch (error) {
            Alert.alert('Алдаа', 'Зээл төлөхөд алдаа гарлаа');
        } finally {
            setActionLoading(false);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
        setBannerIndex(index);
    };

    const renderLoanCard = (item: LoanProductUI) => (
        <BlurView intensity={25} tint="light" style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.durationRow}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.durationText}>{item.duration}</Text>
            </View>

            <Text style={styles.amountLabel}>Боломжит хэмжээ</Text>
            <Text style={styles.amountText}>{item.amount}</Text>

            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                    setSelectedProduct(item);
                    setShowApplyModal(true);
                }}
            >
                <Text style={styles.actionButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
        </BlurView>
    );

    const renderActiveLoanCard = (loan: ActiveLoan) => (
        <BlurView intensity={35} tint="light" style={styles.activeLoanCard}>
            <View style={styles.activeHeader}>
                <View>
                    <Text style={styles.activeLabel}>Үлдэгдэл баланс</Text>
                    <Text style={styles.activeAmount}>₮{loan.remainingBalance.toLocaleString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: loan.status === 'ACTIVE' ? '#10B98120' : '#EF444420' }]}>
                    <Text style={[styles.statusText, { color: loan.status === 'ACTIVE' ? '#10B981' : '#EF4444' }]}>{loan.status}</Text>
                </View>
            </View>

            <View style={styles.loanDetailsRow}>
                <View>
                    <Text style={styles.detailLabel}>Нийт дүн</Text>
                    <Text style={styles.detailValue}>₮{loan.principalAmount.toLocaleString()}</Text>
                </View>
                <View>
                    <Text style={styles.detailLabel}>Дуусах хугацаа</Text>
                    <Text style={styles.detailValue}>{new Date(loan.endDate).toLocaleDateString()}</Text>
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
                    <Text style={styles.repayButtonText}>Зээл төлөх</Text>
                </LinearGradient>
            </TouchableOpacity>
        </BlurView>
    );

    return (
        <LinearGradient
            colors={['#1a1642', '#221a52', '#311a63', '#421a52', '#4a1a4a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: '#4F46E5', width: 400, height: 400, opacity: 0.18 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: '#4f7abdff', width: 350, height: 350, opacity: 0.15 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: '#ae4479ff', width: 380, height: 380, opacity: 0.18 }]} />
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Зээл</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Active Loans Section */}
                    {loans.length > 0 && (
                        <View style={styles.activeSection}>
                            <Text style={styles.sectionTitle}>Миний зээлүүд</Text>
                            {loans.map((loan) => (
                                <View key={loan.id} style={{ marginBottom: 15 }}>
                                    {renderActiveLoanCard(loan)}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Banner Section */}
                    {!loans.length && (
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
                                {BANNER_DATA.map((item) => (
                                    <BlurView key={item.id} intensity={25} tint="light" style={styles.bannerItem}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}
                                            contentFit="cover"
                                        />
                                        <View style={styles.bannerOverlay} />
                                        <View style={styles.bannerContent}>
                                            <View style={styles.bannerTextContainer}>
                                                <Text style={styles.bannerTitle}>{item.title}</Text>
                                                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.bannerButton}>
                                                <Text style={styles.bannerButtonText}>Дэлгэрэнгүй</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </BlurView>
                                ))}
                            </ScrollView>

                            <View style={styles.paginationContainer}>
                                {BANNER_DATA.map((_, index) => (
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

                    <Text style={styles.sectionTitle}>Зээлийн бүтээгдэхүүнүүд</Text>
                    <View style={styles.grid}>
                        {LOAN_DATA.map((item) => (
                            <View key={item.id} style={styles.cardWrapper}>
                                {renderLoanCard(item)}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Animated.View>

            {/* Apply Loan Modal */}
            <Modal visible={showApplyModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <BlurView intensity={80} tint="dark" style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedProduct?.title}</Text>
                            <TouchableOpacity onPress={() => { setShowApplyModal(false); setApplication(null); }}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {!application ? (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Хүсэх дүн</Text>
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
                                    <Text style={styles.inputLabel}>Хугацаа (сараар)</Text>
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
                                    style={styles.modalButton}
                                    onPress={handleApply}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalButtonText}>Хүсэлт илгээх</Text>}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.resultContainer}>
                                <View style={styles.successIcon}>
                                    <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                                </View>
                                <Text style={styles.resultTitle}>Таны зээл батлагдлаа!</Text>
                                <View style={styles.resultDetails}>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Батлагдсан дүн:</Text>
                                        <Text style={styles.resultValue}>₮{application.maxEligibleAmount.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Хугацаа:</Text>
                                        <Text style={styles.resultValue}>{application.requestedTermMonths} сар</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#10B981' }]}
                                    onPress={handleDisburse}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalButtonText}>Зээл авах</Text>}
                                </TouchableOpacity>
                            </View>
                        )}
                    </BlurView>
                </View>
            </Modal>

            {/* Repay Modal */}
            <Modal visible={showRepayModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <BlurView intensity={80} tint="dark" style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Зээл төлөх</Text>
                            <TouchableOpacity onPress={() => setShowRepayModal(false)}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Төлөх дүн</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={repayAmount}
                                onChangeText={setRepayAmount}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                            />
                            <Text style={styles.balanceInfo}>Үлдэгдэл: ₮{selectedLoan?.remainingBalance.toLocaleString()}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#10B981' }]}
                            onPress={handleRepay}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalButtonText}>Төлөх</Text>}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
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
        marginBottom: 8,
    },
    durationText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
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
