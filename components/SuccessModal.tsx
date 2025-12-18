import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SuccessModalProps {
    visible: boolean;
    amount: number;
    onClose: () => void;
}

import { useTranslation } from 'react-i18next';

export default function SuccessModal({ visible, amount, onClose }: SuccessModalProps) {
    const { t } = useTranslation();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const checkmarkAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            checkmarkAnim.setValue(0);
            fadeAnim.setValue(0);

            // Sequential animations
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.spring(checkmarkAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                {/* Decorative circles */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                <View style={styles.decorativeCircle3} />

                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Success Icon with Animation */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconOuterRing}>
                            <View style={styles.iconMiddleRing}>
                                <View style={styles.iconCircle}>
                                    <Animated.View
                                        style={{
                                            transform: [{ scale: checkmarkAnim }],
                                        }}
                                    >
                                        <Ionicons name="checkmark-sharp" size={48} color="white" />
                                    </Animated.View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Success Message */}
                    <Text style={styles.title}>{t('successModal.title')}</Text>
                    <Text style={styles.subtitle}>{t('successModal.subtitle')}</Text>

                    {/* Amount Display with Gradient Effect */}
                    <View style={styles.amountSection}>
                        <Text style={styles.amountLabel}>{t('successModal.amountLabel')}</Text>
                        <View style={styles.amountContainer}>
                            <Text style={styles.currencySymbol}>₮</Text>
                            <Text style={styles.amountText}>{amount.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Info Message */}
                    <View style={styles.infoContainer}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.infoText}>
                            {t('successModal.info')}
                        </Text>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.buttonText}>{t('successModal.button')}</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: 100,
        right: 40,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 150,
        left: 30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    decorativeCircle3: {
        position: 'absolute',
        top: 200,
        left: 50,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(196, 181, 253, 0.12)',
    },
    modalContainer: {
        backgroundColor: '#1E2238',
        borderRadius: 32,
        padding: 36,
        alignItems: 'center',
        width: '100%',
        maxWidth: 360,
        shadowColor: '#A78BFA',
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 15,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.2)',
    },
    iconContainer: {
        marginBottom: 28,
    },
    iconOuterRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconMiddleRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(167, 139, 250, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#A78BFA',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginBottom: 32,
    },
    amountSection: {
        width: '100%',
        marginBottom: 24,
    },
    amountLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        paddingVertical: 20,
        paddingHorizontal: 28,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    currencySymbol: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#A78BFA',
        marginRight: 4,
    },
    amountText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#A78BFA',
        letterSpacing: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    infoText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        marginLeft: 8,
        flex: 1,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#A78BFA',
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 28,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#A78BFA',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
