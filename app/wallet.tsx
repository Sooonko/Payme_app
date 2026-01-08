import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Animated, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { sendMoney, UserSearchResponse } from '../src/api/client';
import { useTheme } from '../src/contexts/ThemeContext';

export default function Wallet() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
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
            Alert.alert(t('wallet.errors.invalidAmount'), t('wallet.errors.enterValidAmount'));
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
                Alert.alert(t('common.error'), response.message || t('wallet.errors.failed'));
            }
        } catch (error) {
            Alert.alert(t('common.error'), t('register.errors.network'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={colors.backgroundGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

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
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('wallet.title')}</Text>
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Amount Input Card */}
                <Animated.View
                    style={[
                        styles.amountCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                            backgroundColor: colors.glassBackground,
                            borderColor: colors.glassBorder,
                        }
                    ]}
                >

                    <View style={styles.amountContainer}>
                        <Text style={[styles.currencySymbol, { color: colors.tint }]}>₮</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                            keyboardType="numeric"
                            style={[styles.amountInput, { color: colors.text }]}
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

                    <View style={styles.quickAmountsContainer}>
                        {quickAmounts.map((amt) => (
                            <TouchableOpacity
                                key={amt}
                                style={[
                                    styles.quickAmountChip,
                                    { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder },
                                    amount === amt && { backgroundColor: isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(124, 58, 237, 0.1)', borderColor: colors.tint }
                                ]}
                                onPress={() => setAmount(amt)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    { color: colors.textSecondary },
                                    amount === amt && { color: colors.tint, fontWeight: 'bold' }
                                ]}>₮{amt}</Text>
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
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('wallet.sendTo')}</Text>
                            <TouchableOpacity onPress={() => {
                                setSelectedUser(null);
                                router.setParams({ userId: '', name: '', phone: '', walletId: '' });
                            }}>
                                <Text style={[styles.changeText, { color: colors.tint }]}>{t('wallet.change')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.recipientCard, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                            <View style={styles.methodLeft}>
                                <View style={styles.recipientAvatar}>
                                    <Text style={styles.avatarText}>{selectedUser.name.charAt(0).toUpperCase()}</Text>
                                </View>
                                <View style={styles.recipientInfo}>
                                    <Text style={[styles.recipientName, { color: colors.text }]}>{selectedUser.name}</Text>
                                    <View style={styles.phoneRow}>
                                        <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                                        <Text style={[styles.recipientPhone, { color: colors.textSecondary }]}>{selectedUser.phone}</Text>
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
                            colors={isDark ? ['#A78BFA', '#8B5CF6', '#7C3AED'] : ['#8B5CF6', '#7C3AED', '#6D28D9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.confirmButtonGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.confirmButtonText}>
                                        {selectedUser ? t('wallet.button.confirm') : t('wallet.button.select')}
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
                    <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={80} color="#4ADE80" />
                        </View>
                        <Text style={[styles.successTitle, { color: colors.text }]}>{t('wallet.success.title')}</Text>
                        <Text style={styles.successAmount}>₮{parseFloat(amount || '0').toFixed(2)}</Text>
                        <Text style={[styles.successRecipient, { color: colors.textSecondary }]}>{t('wallet.success.to')} {selectedUser?.name}</Text>
                        <TouchableOpacity
                            style={[styles.doneButton, { backgroundColor: colors.tint }]}
                            onPress={() => {
                                setShowSuccessModal(false);
                                setAmount('');
                                setSelectedUser(null);
                                router.setParams({ userId: '', name: '', phone: '', walletId: '', amount: '' });
                            }}
                        >
                            <Text style={styles.doneButtonText}>{t('wallet.success.done')}</Text>
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
