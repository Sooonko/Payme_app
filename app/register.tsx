import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerUser } from '../src/api/client';

export default function Register() {
    const { t } = useTranslation();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Animation values
    const nameLabelAnim = useRef(new Animated.Value(0)).current;
    const emailLabelAnim = useRef(new Animated.Value(0)).current;
    const phoneLabelAnim = useRef(new Animated.Value(0)).current;
    const passwordLabelAnim = useRef(new Animated.Value(0)).current;
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const iconFloatAnim = useRef(new Animated.Value(0)).current;
    const iconGlowAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Auto-show floating labels when values exist
    useEffect(() => {
        if (name) {
            setNameFocused(true);
            Animated.timing(nameLabelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else if (!nameFocused) {
            Animated.timing(nameLabelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [name, nameFocused]);

    useEffect(() => {
        if (email) {
            setEmailFocused(true);
            Animated.timing(emailLabelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else if (!emailFocused) {
            Animated.timing(emailLabelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [email, emailFocused]);

    useEffect(() => {
        if (phoneNumber) {
            setPhoneFocused(true);
            Animated.timing(phoneLabelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else if (!phoneFocused) {
            Animated.timing(phoneLabelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [phoneNumber, phoneFocused]);

    useEffect(() => {
        if (password) {
            setPasswordFocused(true);
            Animated.timing(passwordLabelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else if (!passwordFocused) {
            Animated.timing(passwordLabelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [password, passwordFocused]);

    const handleFocus = (field: 'name' | 'email' | 'phone' | 'password') => {
        const setters = {
            name: () => {
                setNameFocused(true);
                Animated.timing(nameLabelAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            },
            email: () => {
                setEmailFocused(true);
                Animated.timing(emailLabelAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            },
            phone: () => {
                setPhoneFocused(true);
                Animated.timing(phoneLabelAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            },
            password: () => {
                setPasswordFocused(true);
                Animated.timing(passwordLabelAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            },
        };
        setters[field]();
    };

    const handleBlur = (field: 'name' | 'email' | 'phone' | 'password', value: string) => {
        if (!value) {
            const setters = {
                name: () => {
                    setNameFocused(false);
                    Animated.timing(nameLabelAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
                },
                email: () => {
                    setEmailFocused(false);
                    Animated.timing(emailLabelAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
                },
                phone: () => {
                    setPhoneFocused(false);
                    Animated.timing(phoneLabelAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
                },
                password: () => {
                    setPasswordFocused(false);
                    Animated.timing(passwordLabelAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
                },
            };
            setters[field]();
        }
    };

    const animateButton = () => {
        Animated.spring(buttonScaleAnim, {
            toValue: 0.96,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start(() => {
            Animated.spring(buttonScaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        });
    };

    // Shimmer animation for loading state
    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            shimmerAnim.setValue(0);
        }
    }, [loading]);

    // Icon floating and glow animation
    useEffect(() => {
        // Floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconFloatAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconFloatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Glow pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconGlowAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(iconGlowAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Button pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.02,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleRegister = async () => {
        animateButton();

        let newErrors = { name: '', email: '', phone: '', password: '' };
        let hasError = false;

        if (!name) {
            newErrors.name = t('register.errors.nameRequired');
            hasError = true;
        }

        if (!email) {
            newErrors.email = t('register.errors.emailRequired');
            hasError = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = t('register.errors.emailInvalid');
                hasError = true;
            }
        }

        if (!phoneNumber) {
            newErrors.phone = t('register.errors.phoneRequired');
            hasError = true;
        } else if (phoneNumber.length !== 8 || !/^\d+$/.test(phoneNumber)) {
            newErrors.phone = t('register.errors.phoneInvalid');
            hasError = true;
        }

        if (!password) {
            newErrors.password = t('register.errors.passwordRequired');
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        setLoading(true);
        try {
            const response = await registerUser({
                name,
                email,
                phone: phoneNumber,
                password
            });

            if (response.success) {
                Alert.alert(t('register.success.title'), t('register.success.message'), [
                    { text: t('register.success.ok'), onPress: () => router.push('/home') }
                ]);
            } else {
                Alert.alert(t('register.errors.failed'), response.message || t('register.errors.generic'));
            }
        } catch (error) {
            console.error('Registration error details:', error);
            Alert.alert(t('common.error'), t('register.errors.network'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#1E1B4B', '#312E81', '#4C1D95', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Animated.View
                            style={[
                                styles.logoContainer,
                                {
                                    transform: [
                                        {
                                            translateY: iconFloatAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -10],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Animated.View
                                style={{
                                    opacity: iconGlowAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 1],
                                    }),
                                }}
                            >
                                <Ionicons name="person-add" size={48} color="#A78BFA" />
                            </Animated.View>
                        </Animated.View>
                        <Text style={styles.title}>{t('register.title')}</Text>
                        <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Name Input with Floating Label */}
                        <View style={styles.inputWrapper}>
                            <Animated.Text
                                style={[
                                    styles.floatingLabel,
                                    {
                                        transform: [
                                            {
                                                translateY: nameLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -28],
                                                }),
                                            },
                                            {
                                                scale: nameLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 0.85],
                                                }),
                                            },
                                        ],
                                        opacity: nameLabelAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ]}
                            >
                                {t('register.name')}
                            </Animated.Text>
                            <View style={[
                                styles.inputContainer,
                                nameFocused && styles.inputFocused,
                                errors.name && styles.inputError
                            ]}>
                                <Ionicons name="person-outline" size={20} color={nameFocused ? "#A78BFA" : "#8F92A1"} style={styles.icon} />
                                <TextInput
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        setErrors({ ...errors, name: '' });
                                    }}
                                    onFocus={() => handleFocus('name')}
                                    onBlur={() => handleBlur('name', name)}
                                    placeholder={!nameFocused ? t('register.name') : ""}
                                    placeholderTextColor="#8F92A1"
                                    style={styles.input}
                                />
                            </View>
                            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                        </View>

                        {/* Email Input with Floating Label */}
                        <View style={styles.inputWrapper}>
                            <Animated.Text
                                style={[
                                    styles.floatingLabel,
                                    {
                                        transform: [
                                            {
                                                translateY: emailLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -28],
                                                }),
                                            },
                                            {
                                                scale: emailLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 0.85],
                                                }),
                                            },
                                        ],
                                        opacity: emailLabelAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ]}
                            >
                                {t('register.email')}
                            </Animated.Text>
                            <View style={[
                                styles.inputContainer,
                                emailFocused && styles.inputFocused,
                                errors.email && styles.inputError
                            ]}>
                                <Ionicons name="mail-outline" size={20} color={emailFocused ? "#A78BFA" : "#8F92A1"} style={styles.icon} />
                                <TextInput
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setErrors({ ...errors, email: '' });
                                    }}
                                    onFocus={() => handleFocus('email')}
                                    onBlur={() => handleBlur('email', email)}
                                    placeholder={!emailFocused ? t('register.email') : ""}
                                    placeholderTextColor="#8F92A1"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                />
                            </View>
                            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                        </View>

                        {/* Phone Input with Floating Label */}
                        <View style={styles.inputWrapper}>
                            <Animated.Text
                                style={[
                                    styles.floatingLabel,
                                    {
                                        transform: [
                                            {
                                                translateY: phoneLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -28],
                                                }),
                                            },
                                            {
                                                scale: phoneLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 0.85],
                                                }),
                                            },
                                        ],
                                        opacity: phoneLabelAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ]}
                            >
                                {t('register.phone')}
                            </Animated.Text>
                            <View style={[
                                styles.inputContainer,
                                phoneFocused && styles.inputFocused,
                                errors.phone && styles.inputError
                            ]}>
                                <Ionicons name="call-outline" size={20} color={phoneFocused ? "#A78BFA" : "#8F92A1"} style={styles.icon} />
                                <TextInput
                                    value={phoneNumber}
                                    onChangeText={(text) => {
                                        setPhoneNumber(text);
                                        setErrors({ ...errors, phone: '' });
                                    }}
                                    onFocus={() => handleFocus('phone')}
                                    onBlur={() => handleBlur('phone', phoneNumber)}
                                    placeholder={!phoneFocused ? t('register.phone') : ""}
                                    placeholderTextColor="#8F92A1"
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                />
                            </View>
                            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                        </View>

                        {/* Password Input with Floating Label */}
                        <View style={styles.inputWrapper}>
                            <Animated.Text
                                style={[
                                    styles.floatingLabel,
                                    {
                                        transform: [
                                            {
                                                translateY: passwordLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -28],
                                                }),
                                            },
                                            {
                                                scale: passwordLabelAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 0.85],
                                                }),
                                            },
                                        ],
                                        opacity: passwordLabelAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ]}
                            >
                                {t('register.password')}
                            </Animated.Text>
                            <View style={[
                                styles.inputContainer,
                                passwordFocused && styles.inputFocused,
                                errors.password && styles.inputError
                            ]}>
                                <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? "#A78BFA" : "#8F92A1"} style={styles.icon} />
                                <TextInput
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setErrors({ ...errors, password: '' });
                                    }}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={() => handleBlur('password', password)}
                                    placeholder={!passwordFocused ? t('register.password') : ""}
                                    placeholderTextColor="#8F92A1"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.input}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={passwordFocused ? "#A78BFA" : "#8F92A1"}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        </View>

                        {/* Register Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }, { scale: pulseAnim }] }}>
                            <TouchableOpacity
                                onPress={handleRegister}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.registerButton}
                                >
                                    {loading && (
                                        <Animated.View
                                            style={[
                                                styles.shimmerOverlay,
                                                {
                                                    transform: [
                                                        {
                                                            translateX: shimmerAnim.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [-300, 300],
                                                            }),
                                                        },
                                                    ],
                                                },
                                            ]}
                                        />
                                    )}
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text style={styles.registerButtonText}>{t('register.button')}</Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Login Link */}
                        <Text style={styles.loginText}>
                            {t('register.hasAccount')} <Text style={styles.loginLink} onPress={() => router.push('/login')}>{t('register.login')}</Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 80,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.3)',
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '400',
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    floatingLabel: {
        position: 'absolute',
        left: 20,
        top: 18,
        fontSize: 16,
        color: '#A78BFA',
        fontWeight: '600',
        zIndex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputFocused: {
        borderColor: '#A78BFA',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
    },
    inputError: {
        borderColor: '#FF4B4B',
        backgroundColor: 'rgba(255, 75, 75, 0.05)',
    },
    errorText: {
        color: '#FF4B4B',
        fontSize: 12,
        marginLeft: 16,
        marginTop: 6,
        fontWeight: '500',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 4,
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 100,
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 18,
        marginTop: 8,
        marginBottom: 24,
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'hidden',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    loginText: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    loginLink: {
        color: '#A78BFA',
        fontWeight: '700',
    },
});
