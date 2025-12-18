import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type Mode = 'send' | 'request' | 'qr';

export default function Scan() {
    const router = useRouter();
    const [amount, setAmount] = useState('0');
    const [mode, setMode] = useState<Mode>('send');

    const handleKeyPress = (key: string) => {
        if (key === 'C') {
            setAmount('0');
        } else if (key === 'backspace') {
            setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
        } else {
            setAmount(prev => (prev === '0' ? key : (prev + key).substring(0, 9)));
        }
    };

    const keys = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['C', '0', 'backspace'],
    ];

    const handleConfirm = () => {
        if (amount !== '0' && mode === 'send') {
            router.push({ pathname: '/user-search', params: { amount } });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* HYPER-VIBRANT ULTIMATE MESH BACKGROUND */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['#050510', '#0a0a25']}
                    style={StyleSheet.absoluteFill}
                />
                {/* Neon Mesh Blobs - Precision HEX Saturation */}
                <View style={[styles.meshBlob, { top: '2%', right: '-20%', backgroundColor: '#0066FF', width: 550, height: 550, opacity: 0.5 }]} />
                <View style={[styles.meshBlob, { bottom: '10%', left: '-25%', backgroundColor: '#FF00CC', width: 650, height: 650, opacity: 0.45 }]} />
                <View style={[styles.meshBlob, { top: '30%', left: '5%', backgroundColor: '#9900FF', width: 500, height: 500, opacity: 0.4 }]} />
                <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            </View>

            {/* PRECISE TOP NAVIGATION GLASS PILL */}
            <View style={styles.header}>
                <BlurView intensity={35} tint="light" style={styles.navPill}>
                    <TouchableOpacity
                        style={[styles.navItem, mode === 'send' && styles.activeNavItem]}
                        onPress={() => setMode('send')}
                    >
                        <Ionicons name="paper-plane" size={24} color={mode === 'send' ? '#fff' : 'rgba(255,255,255,0.4)'} />
                    </TouchableOpacity>
                    <View style={styles.navDivider} />
                    <TouchableOpacity
                        style={[styles.navItem, mode === 'request' && styles.activeNavItem]}
                        onPress={() => setMode('request')}
                    >
                        <Ionicons name="receipt" size={24} color={mode === 'request' ? '#fff' : 'rgba(255,255,255,0.4)'} />
                    </TouchableOpacity>
                    <View style={styles.navDivider} />
                    <TouchableOpacity
                        style={[styles.navItem, mode === 'qr' && styles.activeNavItem]}
                        onPress={() => setMode('qr')}
                    >
                        <Ionicons name="qr-code" size={24} color={mode === 'qr' ? '#fff' : 'rgba(255,255,255,0.4)'} />
                    </TouchableOpacity>
                </BlurView>
            </View>

            {/* FLOATING AMOUNT - CLINICAL PRECISION */}
            <View style={styles.amountArea}>
                <Text style={styles.amountText}>{amount}</Text>
                <Text style={styles.currencyText}>₮</Text>
            </View>

            {/* PREMIUM CRYSTAL KEYPAD */}
            <View style={styles.keypadContainer}>
                {keys.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.keypadRow}>
                        {row.map((key) => (
                            <TouchableOpacity
                                key={key}
                                style={styles.keyCircle}
                                onPress={() => handleKeyPress(key)}
                                activeOpacity={0.6}
                            >
                                <BlurView intensity={30} tint="light" style={styles.keyInner}>
                                    {key === 'backspace' ? (
                                        <Ionicons name="backspace-outline" size={26} color="white" />
                                    ) : (
                                        <Text style={styles.keyNumber}>{key}</Text>
                                    )}
                                </BlurView>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>

            {/* NEON-INFUSED CONFIRM BUTTON */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.confirmShadow}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#FF00A0', '#D946EF']}
                        style={styles.confirmButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.confirmText}>Confirm Payment</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    meshBlob: {
        position: 'absolute',
        borderRadius: height,
    },
    header: {
        marginTop: height * 0.08,
        alignItems: 'center',
    },
    navPill: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderWidth: 1.2,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        overflow: 'hidden',
    },
    navItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeNavItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
    },
    navDivider: {
        width: 1,
        height: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 8,
    },
    amountArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: height * 0.04,
        marginBottom: 20,
    },
    amountText: {
        fontSize: 104,
        fontWeight: '100',
        color: 'white',
        letterSpacing: -4,
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
    },
    currencyText: {
        fontSize: 36,
        color: 'rgba(255, 255, 255, 0.7)',
        marginLeft: 10,
        marginBottom: 28,
        fontWeight: '100',
    },
    keypadContainer: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: 'center',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    keyCircle: {
        width: 78,
        height: 78,
        borderRadius: 39,
        overflow: 'hidden',
    },
    keyInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1.2,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    keyNumber: {
        fontSize: 34,
        color: 'white',
        fontWeight: '200',
    },
    footer: {
        paddingHorizontal: 50,
        paddingBottom: 110,
    },
    confirmShadow: {
        shadowColor: '#FF00CC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 25,
        elevation: 20,
    },
    confirmButton: {
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    confirmText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
});
