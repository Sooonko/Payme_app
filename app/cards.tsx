import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardData, getCards } from '../src/api/client';
import { useTheme } from '../src/contexts/ThemeContext';

export default function Cards() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCards = async () => {
        setLoading(true);
        try {
            const response = await getCards();
            if (response.success) {
                setCards(response.data);
            } else {
                Alert.alert(t('common.error'), response.message || t('cards.empty.title'));
            }
        } catch (error) {
            console.error('Load cards error:', error);
            Alert.alert(t('common.error'), t('register.errors.network'));
        } finally {
            setLoading(false);
        }
    };

    // Load cards when page is focused
    useFocusEffect(
        useCallback(() => {
            loadCards();
        }, [])
    );

    const handleBack = () => {
        const from = params.from as string;
        if (from === 'profile') {
            router.push('/profile');
        } else {
            router.push('/home');
        }
    };

    const handleDeleteCard = (cardId: string) => {
        Alert.alert(
            t('cards.actions.delete'),
            t('cards.actions.deleteConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('cards.actions.delete'),
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Implement delete card API
                        Alert.alert(t('common.info'), t('cards.actions.deleteFeature'));
                    }
                }
            ]
        );
    };

    const getCardIcon = (cardType: string) => {
        switch (cardType) {
            case 'VISA':
                return 'card';
            case 'MASTERCARD':
                return 'card';
            case 'AMEX':
                return 'card';
            case 'DISCOVER':
                return 'card';
            default:
                return 'card-outline';
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
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={[styles.backButton, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('cards.title')}</Text>
                <TouchableOpacity onPress={() => router.push('/add-card')} style={[styles.backButton, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                    <Ionicons name="add" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.tint} />
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('cards.loading')}</Text>
                    </View>
                ) : (
                    <>
                        {/* Cards List */}
                        <View style={styles.cardsSection}>
                            {cards.length > 0 ? (
                                cards.map((card) => (
                                    <View key={card.id} style={[styles.cardItem, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                                        <View style={styles.cardLeft}>
                                            <View style={[styles.cardIconContainer, { backgroundColor: isDark ? 'rgba(167, 139, 250, 0.15)' : 'rgba(124, 58, 237, 0.1)' }]}>
                                                <Ionicons name={getCardIcon(card.cardType)} size={24} color={colors.tint} />
                                            </View>
                                            <View>
                                                <View style={styles.cardNameRow}>
                                                    <Text style={[styles.cardName, { color: colors.text }]}>{card.cardType}</Text>
                                                    {card.isDefault && (
                                                        <View style={[styles.defaultBadge, { backgroundColor: colors.tint }]}>
                                                            <Text style={styles.defaultBadgeText}>{t('cards.badge')}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={[styles.cardNumber, { color: colors.textSecondary }]}>•••• •••• •••• {card.cardNumberLast4}</Text>
                                                <Text style={[styles.cardExpiry, { color: colors.textSecondary, opacity: 0.7 }]}>
                                                    Expires {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardActions}>
                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
                                                onPress={() => Alert.alert(t('common.info'), t('cards.actions.edit'))}
                                            >
                                                <Ionicons name="create-outline" size={20} color={colors.tint} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
                                                onPress={() => handleDeleteCard(card.id)}
                                            >
                                                <Ionicons name="trash-outline" size={20} color={colors.notification} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Ionicons name="card-outline" size={64} color={colors.border} />
                                    <Text style={[styles.emptyStateText, { color: colors.text }]}>{t('cards.empty.title')}</Text>
                                    <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                                        {t('cards.empty.subtitle')}
                                    </Text>
                                </View>
                            )}

                            {/* Add New Card Button */}
                            <TouchableOpacity
                                style={[styles.addCardButton, { backgroundColor: isDark ? 'rgba(167, 139, 250, 0.1)' : 'rgba(124, 58, 237, 0.05)', borderColor: isDark ? 'rgba(167, 139, 250, 0.3)' : 'rgba(124, 58, 237, 0.2)' }]}
                                onPress={() => router.push('/add-card')}
                            >
                                <Ionicons name="add-circle-outline" size={24} color={colors.tint} />
                                <Text style={[styles.addCardText, { color: colors.tint }]}>{t('cards.button')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info Section */}
                        <View style={[styles.infoSection, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
                            <Text style={[styles.infoTitle, { color: colors.text }]}>{t('cards.info.title')}</Text>
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                {t('cards.info.text')}
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        color: 'rgba(255,255,255,0.6)',
        marginTop: 16,
        fontSize: 16,
    },
    cardsSection: {
        marginBottom: 32,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 8,
    },
    defaultBadge: {
        backgroundColor: '#A78BFA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    defaultBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    cardNumber: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 2,
    },
    cardExpiry: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 8,
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.3)',
        borderStyle: 'dashed',
        marginTop: 12,
    },
    addCardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#A78BFA',
        marginLeft: 8,
    },
    infoSection: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 20,
    },
});
