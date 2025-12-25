import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type Mode = 'send' | 'qr' | 'invoice';

export default function Scan() {
    const router = useRouter();
    const [amount, setAmount] = useState('0');
    const [isQRMode, setIsQRMode] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useFocusEffect(
        useCallback(() => {
            setAmount('0');

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
        }, [])
    );

    const handleKeyPress = (key: string) => {
        if (key === 'C') {
            setAmount('0');
        } else if (key === 'backspace') {
            setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
        } else {
            setAmount(prev => {
                const nextValue = prev === '0' ? key : prev + key;
                if (parseInt(nextValue) > 5000000) return prev;
                return nextValue;
            });
        }
    };

    const keys = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['C', '0', 'backspace'],
    ];

    const handleAction = (type: Mode) => {
        if (type === 'send' || type === 'invoice') {
            if (amount !== '0') {
                router.push({ pathname: '/user-search', params: { amount, type, from: 'scan' } });
            }
        } else if (type === 'qr') {
            setIsQRMode(!isQRMode);
        }
    };

    return (
        <LinearGradient
            colors={['#1a1642', '#221a52', '#311a63', '#421a52', '#4a1a4a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Background Glows matching home.tsx */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: '#4F46E5', width: 400, height: 400, opacity: 0.18 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: '#4f7abdff', width: 350, height: 350, opacity: 0.15 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: '#ae4479ff', width: 380, height: 380, opacity: 0.18 }]} />
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                {isQRMode ? (
                    <View style={styles.qrContainer}>
                        <View style={styles.scanFrame}>
                            <View style={styles.cornerTopLeft} />
                            <View style={styles.cornerTopRight} />
                            <View style={styles.cornerBottomLeft} />
                            <View style={styles.cornerBottomRight} />
                            <BlurView intensity={10} tint="light" style={styles.scanBlur} />
                            <TouchableOpacity
                                onPress={() => setIsQRMode(false)}
                                style={styles.closeQR}
                            >
                                <Ionicons name="close" size={30} color="white" />
                            </TouchableOpacity>
                            <Ionicons name="scan-outline" size={100} color="rgba(255,255,255,0.2)" />
                        </View>
                        <Text style={styles.scanTitle}>Scan QR Code</Text>
                    </View>
                ) : (
                    <>
                        {/* CARD 1: AMOUNT DISPLAY */}
                        <BlurView intensity={25} tint="light" style={styles.amountCard}>
                            <Text style={styles.amountLabel}>Total Amount</Text>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>{parseInt(amount).toLocaleString()}</Text>
                                <Text style={styles.currencyText}>₮</Text>
                            </View>
                        </BlurView>

                        {/* CARD 2: KEYBOARD */}
                        <BlurView intensity={20} tint="light" style={styles.keyboardCard}>
                            <View style={styles.keypadGrid}>
                                {keys.map((row, rowIndex) => (
                                    <View key={rowIndex} style={styles.keypadRow}>
                                        {row.map((key) => (
                                            <TouchableOpacity
                                                key={key}
                                                style={styles.keyButton}
                                                onPress={() => handleKeyPress(key)}
                                                activeOpacity={0.5}
                                            >
                                                {key === 'backspace' ? (
                                                    <Ionicons name="backspace-outline" size={28} color="white" />
                                                ) : (
                                                    <Text style={styles.keyText}>{key}</Text>
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </BlurView>
                    </>
                )}

                {/* CARD 3: MODE ACTIONS */}
                <BlurView intensity={30} tint="light" style={styles.actionCard}>
                    <View style={styles.actionGrid}>
                        <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('send')}>
                            <View style={[styles.actionIconPill, { backgroundColor: 'rgba(79, 70, 229, 0.2)' }]}>
                                <Ionicons name="paper-plane-outline" size={24} color="#818CF8" />
                            </View>
                            <Text style={styles.actionLabel}>Send</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('qr')}>
                            <View style={[styles.actionIconPill, { backgroundColor: 'rgba(147, 51, 234, 0.2)' }]}>
                                <Ionicons name="qr-code-outline" size={24} color="#C084FC" />
                            </View>
                            <Text style={styles.actionLabel}>QR Scan</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('invoice')}>
                            <View style={[styles.actionIconPill, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                                <Ionicons name="receipt-outline" size={24} color="#F472B6" />
                            </View>
                            <Text style={styles.actionLabel}>Invoice</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>

            </Animated.View>
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: height * 0.08,
        paddingBottom: 110,
        justifyContent: 'space-between',
    },
    amountCard: {
        padding: 24,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
    },
    amountLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    amountText: {
        fontSize: 64,
        fontWeight: '200',
        color: 'white',
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    currencyText: {
        fontSize: 28,
        color: 'rgba(255,255,255,0.7)',
        marginLeft: 8,
        fontWeight: '300',
    },
    keyboardCard: {
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
        height: height * 0.42,
        justifyContent: 'center',
    },
    keypadGrid: {
        width: '100%',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    keyButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    keyText: {
        fontSize: 28,
        color: 'white',
        fontWeight: '300',
    },
    actionCard: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    actionItem: {
        alignItems: 'center',
        gap: 6,
    },
    actionIconPill: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    // QR Mode Styles
    qrContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 30,
    },
    scanBlur: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 30,
        overflow: 'hidden',
    },
    scanTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    },
    closeQR: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    cornerTopLeft: {
        position: 'absolute',
        top: -2,
        left: -2,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#818CF8',
        zIndex: 1,
        borderTopLeftRadius: 20,
    },
    cornerTopRight: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#C084FC',
        zIndex: 1,
        borderTopRightRadius: 20,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: -2,
        left: -2,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#F472B6',
        zIndex: 1,
        borderBottomLeftRadius: 20,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#818CF8',
        zIndex: 1,
        borderBottomRightRadius: 20,
    },
});
