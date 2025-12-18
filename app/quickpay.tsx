import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Scan() {
    console.log('Scan screen mounted');
    const router = useRouter();
    const [amount, setAmount] = useState('0');

    const handleKeyPress = (key: string) => {
        if (key === 'backspace') {
            setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
        } else if (key === '000') {
            if (amount !== '0') {
                setAmount(prev => prev + '000');
            }
        } else {
            setAmount(prev => (prev === '0' ? key : prev + key));
        }
    };

    const keys = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['000', '0', 'backspace'],
    ];

    return (
        <LinearGradient
            colors={['#818CF8', '#7C3AED', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            <View style={styles.topSection}>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>{amount}</Text>
                    <Text style={styles.currencySymbol}>₮</Text>
                </View>


            </View>

            <View style={styles.keypadContainer}>
                {keys.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.keypadRow}>
                        {row.map((key) => (
                            <TouchableOpacity
                                key={key}
                                style={styles.key}
                                onPress={() => handleKeyPress(key)}
                                activeOpacity={0.6}
                            >
                                {key === 'backspace' ? (
                                    <Ionicons name="backspace-outline" size={32} color="white" />
                                ) : (
                                    <Text style={styles.keyText}>{key}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Нэхэмжлэх</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.qrButton} onPress={() => router.push('/user-search')}>
                    <Ionicons name="qr-code" size={30} color="#6D28D9" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        if (amount !== '0') {
                            router.push({ pathname: '/user-search', params: { amount } });
                        }
                    }}
                >
                    <Text style={styles.actionButtonText}>Илгээх</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    topSection: {
        alignItems: 'center',
        marginTop: 40,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    amountText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: 'white',
    },
    currencySymbol: {
        fontSize: 40,
        color: 'white',
        marginLeft: 8,
        marginTop: 10,
    },

    keypadContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    key: {
        width: width / 3 - 40,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 32,
        fontWeight: '500',
        color: 'white',
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 110, // Significantly increased to stay above the floating tab bar
    },
    actionButton: {
        flex: 1,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    qrButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
});

