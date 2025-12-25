import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SuccessModal from '../components/SuccessModal';
import { sendMoney } from '../src/api/client';

export default function TransferConfirm() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { userId, name, phone, walletId, amount } = params;
    const displayAmount = parseFloat(amount as string || '0');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
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
            })
        ]).start();
    }, []);

    const handleConfirm = async () => {
        if (!walletId || !amount) return;

        // Button feedback animation
        Animated.sequence([
            Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();

        setLoading(true);
        try {
            const response = await sendMoney({
                toWalletId: walletId as string,
                amount: displayAmount,
                description: 'Transfer'
            });

            if (response.success) {
                setShowSuccessModal(true);
            } else {
                alert(response.message || 'Transfer failed');
            }
        } catch (error) {
            alert('A network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.push('/scan');
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
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: '#ae4479ff', width: 380, height: 380, opacity: 0.18 }]} />
            </View>

            {/* Top Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm Transfer</Text>
                <View style={{ width: 44 }} />
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {/* Recipient Card */}
                <BlurView intensity={25} tint="light" style={styles.recipientCard}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={styles.avatarGradient}
                    >
                        <Text style={styles.avatarText}>{name ? (name as string).charAt(0).toUpperCase() : '?'}</Text>
                    </LinearGradient>
                    <Text style={styles.recipientName}>{name}</Text>
                </BlurView>

                {/* Amount Section */}
                <View style={styles.amountSection}>
                    <Text style={styles.amountLabel}>Transfer Amount</Text>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountValue}>₮ {displayAmount.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Details Breakdown */}
                <BlurView intensity={20} tint="light" style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction Fee</Text>
                        <Text style={styles.detailValue}>₮ 0</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.totalLabel}>Total Payment</Text>
                        <Text style={styles.totalValue}>₮ {displayAmount.toLocaleString()}</Text>
                    </View>
                </BlurView>

                <View style={{ flex: 1 }} />

                {/* Confirm Button */}
                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={loading}
                    activeOpacity={0.8}
                    style={{ transform: [{ scale: buttonScale }] }}
                >
                    <LinearGradient
                        colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.confirmButton}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={styles.confirmButtonText}>Slide to Pay</Text>
                                <View style={styles.buttonIcon}>
                                    <Ionicons name="chevron-forward" size={24} color="white" />
                                </View>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <SuccessModal
                visible={showSuccessModal}
                amount={displayAmount}
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
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.25,
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
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 110,
    },
    recipientCard: {
        padding: 30,
        borderRadius: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
        marginBottom: 40,
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.4)',
    },
    avatarText: {
        fontSize: 44,
        fontWeight: 'bold',
        color: 'white',
    },
    recipientName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 6,
    },
    recipientPhone: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 16,
    },
    walletPill: {
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    walletIdText: {
        color: '#A78BFA',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1,
    },
    amountSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    amountLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(167, 139, 250, 0.4)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    detailsCard: {
        padding: 24,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.5)',
    },
    detailValue: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#A78BFA',
    },
    confirmButton: {
        flexDirection: 'row',
        height: 74,
        borderRadius: 37,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 15,
        elevation: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    buttonIcon: {
        position: 'absolute',
        right: 15,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
