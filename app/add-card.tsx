import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addCard } from '../src/api/client';
import { detectCardType, generateMockCardToken, getCardLast4, validateCardNumber, validateExpiryDate } from '../src/utils/cardUtils';

export default function AddCard() {
    const { t } = useTranslation();
    const router = useRouter();
    const [cardNumber, setCardNumber] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);

    const formatCardNumberInput = (text: string) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add space every 4 digits
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.substring(0, 19); // Max 16 digits + 3 spaces
    };

    const formatExpiryDate = (text: string) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add slash after 2 digits
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    const handleAddCard = async () => {
        // Clean card number
        const cleanedCardNumber = cardNumber.replace(/\s/g, '');

        // Validation
        if (!cardNumber || cleanedCardNumber.length < 13) {
            Alert.alert(t('common.error'), t('addCard.errors.invalidCard'));
            return;
        }

        if (!validateCardNumber(cleanedCardNumber)) {
            Alert.alert(t('common.error'), t('addCard.errors.cardValidationFailed'));
            return;
        }

        if (!cardholderName || cardholderName.trim().length < 2) {
            Alert.alert(t('common.error'), t('addCard.errors.invalidName'));
            return;
        }

        if (!expiryDate || expiryDate.length !== 5) {
            Alert.alert(t('common.error'), t('addCard.errors.invalidExpiry'));
            return;
        }

        // Parse expiry date
        const [monthStr, yearStr] = expiryDate.split('/');
        const expiryMonth = parseInt(monthStr, 10);
        const expiryYear = 2000 + parseInt(yearStr, 10); // Convert YY to YYYY

        if (!validateExpiryDate(expiryMonth, expiryYear)) {
            Alert.alert(t('common.error'), t('addCard.errors.expired'));
            return;
        }

        if (!cvv || cvv.length !== 3) {
            Alert.alert(t('common.error'), t('addCard.errors.invalidCvv'));
            return;
        }

        setLoading(true);
        try {
            // Detect card type
            const cardType = detectCardType(cleanedCardNumber);

            if (cardType === 'UNKNOWN') {
                Alert.alert(t('common.error'), t('addCard.errors.unsupported'));
                setLoading(false);
                return;
            }

            // Generate mock token (TODO: Replace with real payment gateway)
            const cardToken = generateMockCardToken(cleanedCardNumber);

            // Get last 4 digits
            const cardNumberLast4 = getCardLast4(cleanedCardNumber);

            // Call API
            const response = await addCard({
                cardHolderName: cardholderName.trim(),
                cardNumberLast4,
                cardType,
                expiryMonth,
                expiryYear,
                cardToken,
                isDefault: false,
            });

            if (response.success) {
                // Clear sensitive data from state
                setCardNumber('');
                setCardholderName('');
                setExpiryDate('');
                setCvv('');

                Alert.alert(t('common.success'), t('addCard.success'), [
                    { text: 'OK', onPress: () => router.push('/cards') }
                ]);
            } else {
                Alert.alert(t('common.error'), response.message || t('addCard.errors.failed'));
            }
        } catch (error) {
            console.error('Add card error:', error);
            Alert.alert(t('common.error'), t('addCard.errors.network'));
        } finally {
            setLoading(false);
        }
    };

    // Get card type for display
    const displayCardType = cardNumber ? detectCardType(cardNumber.replace(/\s/g, '')) : 'VISA';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/cards')}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('addCard.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Card Preview */}
                <View style={styles.cardPreview}>
                    <View style={styles.cardMockup}>
                        <View style={styles.cardTop}>
                            <Ionicons name="card" size={32} color="white" />
                            <Text style={styles.cardType}>{displayCardType}</Text>
                        </View>
                        <Text style={styles.cardNumberPreview}>
                            {cardNumber || '•••• •••• •••• ••••'}
                        </Text>
                        <View style={styles.cardBottom}>
                            <View>
                                <Text style={styles.cardLabel}>{t('addCard.preview.cardholder')}</Text>
                                <Text style={styles.cardValue}>
                                    {cardholderName || 'YOUR NAME'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel}>{t('addCard.preview.expires')}</Text>
                                <Text style={styles.cardValue}>
                                    {expiryDate || 'MM/YY'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Form Section */}
                <Text style={styles.sectionTitle}>{t('addCard.section')}</Text>

                {/* Card Number */}
                <View style={styles.inputContainer}>
                    <Ionicons name="card-outline" size={20} color="#A78BFA" style={styles.inputIcon} />
                    <TextInput
                        value={cardNumber}
                        onChangeText={(text) => setCardNumber(formatCardNumberInput(text))}
                        placeholder={t('addCard.placeholders.number')}
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="numeric"
                        maxLength={19}
                        style={styles.input}
                    />
                </View>

                {/* Cardholder Name */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#A78BFA" style={styles.inputIcon} />
                    <TextInput
                        value={cardholderName}
                        onChangeText={setCardholderName}
                        placeholder={t('addCard.placeholders.name')}
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        autoCapitalize="words"
                        style={styles.input}
                    />
                </View>

                {/* Expiry Date and CVV */}
                <View style={styles.rowInputs}>
                    <View style={[styles.inputContainer, styles.halfInput]}>
                        <Ionicons name="calendar-outline" size={20} color="#A78BFA" style={styles.inputIcon} />
                        <TextInput
                            value={expiryDate}
                            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                            placeholder={t('addCard.placeholders.expiry')}
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            keyboardType="numeric"
                            maxLength={5}
                            style={styles.input}
                        />
                    </View>
                    <View style={[styles.inputContainer, styles.halfInput]}>
                        <Ionicons name="lock-closed-outline" size={20} color="#A78BFA" style={styles.inputIcon} />
                        <TextInput
                            value={cvv}
                            onChangeText={(text) => setCvv(text.replace(/\D/g, '').substring(0, 3))}
                            placeholder={t('addCard.placeholders.cvv')}
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>
                </View>

                {/* Info Text */}
                <View style={styles.infoBox}>
                    <Ionicons name="shield-checkmark" size={20} color="#4ADE80" />
                    <Text style={styles.infoText}>
                        {t('addCard.info')}
                    </Text>
                </View>

                {/* Add Card Button */}
                <TouchableOpacity
                    style={[styles.addButton, loading && styles.addButtonDisabled]}
                    onPress={handleAddCard}
                    disabled={loading}
                >
                    {loading ? (
                        <Text style={styles.addButtonText}>{t('addCard.buttonAdding')}</Text>
                    ) : (
                        <>
                            <Text style={styles.addButtonText}>{t('addCard.button')}</Text>
                            <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginLeft: 8 }} />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2238',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
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
    cardPreview: {
        marginBottom: 32,
    },
    cardMockup: {
        backgroundColor: '#A78BFA',
        borderRadius: 20,
        padding: 24,
        minHeight: 200,
        justifyContent: 'space-between',
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 2,
    },
    cardNumberPreview: {
        fontSize: 22,
        fontWeight: '600',
        color: 'white',
        letterSpacing: 2,
        marginVertical: 20,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
        letterSpacing: 1,
    },
    cardValue: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.2)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    halfInput: {
        flex: 1,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 24,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 18,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#A78BFA',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonDisabled: {
        opacity: 0.6,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
