import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { updateUserProfile } from '../src/api/client';
import { useTheme } from '../src/contexts/ThemeContext';

export default function EditProfile() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, isDark } = useTheme();

    const [name, setName] = useState(params.name as string || '');
    const [email, setEmail] = useState(params.email as string || '');
    const [phone, setPhone] = useState(params.phone as string || '');
    const [address, setAddress] = useState(params.address as string || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !email || !phone) {
            Alert.alert(t('common.error'), t('editProfile.errors.required'));
            return;
        }

        setLoading(true);
        try {
            const response = await updateUserProfile({
                name,
                email,
                phone,
                address
            });

            if (response.success) {
                Alert.alert(t('common.success'), t('editProfile.success'), [
                    { text: 'OK', onPress: () => router.push('/profile') }
                ]);
            } else {
                Alert.alert(t('common.error'), response.message || t('editProfile.errors.failed'));
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

            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: colors.glows[0], width: 400, height: 400, opacity: isDark ? 0.18 : 0.25 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: colors.glows[1], width: 350, height: 350, opacity: isDark ? 0.15 : 0.2 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: colors.glows[2], width: 380, height: 380, opacity: isDark ? 0.18 : 0.25 }]} />
            </View>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('editProfile.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.fields.name')}</Text>
                        <BlurView intensity={isDark ? 30 : 50} tint={isDark ? "dark" : "light"} style={[styles.inputContainer, { borderColor: colors.glassBorder }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                value={name}
                                onChangeText={setName}
                                placeholder={t('editProfile.placeholders.name')}
                                placeholderTextColor={colors.textSecondary}
                            />
                        </BlurView>
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.fields.email')}</Text>
                        <BlurView intensity={isDark ? 30 : 50} tint={isDark ? "dark" : "light"} style={[styles.inputContainer, { borderColor: colors.glassBorder }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('editProfile.placeholders.email')}
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </BlurView>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.fields.phone')}</Text>
                        <BlurView intensity={isDark ? 30 : 50} tint={isDark ? "dark" : "light"} style={[styles.inputContainer, { borderColor: colors.glassBorder }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder={t('editProfile.placeholders.phone')}
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="phone-pad"
                            />
                        </BlurView>
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.fields.address')}</Text>
                        <BlurView intensity={isDark ? 30 : 50} tint={isDark ? "dark" : "light"} style={[styles.inputContainer, { borderColor: colors.glassBorder }]}>
                            <TextInput
                                style={[styles.input, styles.textArea, { color: colors.text }]}
                                value={address}
                                onChangeText={setAddress}
                                placeholder={t('editProfile.placeholders.address')}
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                numberOfLines={3}
                            />
                        </BlurView>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.tint }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveButtonText}>{t('editProfile.button')}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        fontSize: 28,
        color: 'white',
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
    form: {
        marginTop: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    input: {
        padding: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
