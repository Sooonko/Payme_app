import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { updateUserProfile } from '../src/api/client';

export default function EditProfile() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();

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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('editProfile.fields.name')}</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder={t('editProfile.placeholders.name')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('editProfile.fields.email')}</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder={t('editProfile.placeholders.email')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('editProfile.fields.phone')}</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder={t('editProfile.placeholders.phone')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('editProfile.fields.address')}</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={address}
                            onChangeText={setAddress}
                            placeholder={t('editProfile.placeholders.address')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.saveButton}
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
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
