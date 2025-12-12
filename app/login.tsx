import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Modal, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser } from '../src/api/client';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Animation values
    const emailLabelAnim = useRef(new Animated.Value(0)).current;
    const passwordLabelAnim = useRef(new Animated.Value(0)).current;
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const iconFloatAnim = useRef(new Animated.Value(0)).current;
    const iconGlowAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Auto-show floating labels when values exist
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

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailFocus = () => {
        setEmailFocused(true);
        Animated.timing(emailLabelAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleEmailBlur = () => {
        if (!email) {
            setEmailFocused(false);
            Animated.timing(emailLabelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePasswordFocus = () => {
        setPasswordFocused(true);
        Animated.timing(passwordLabelAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handlePasswordBlur = () => {
        if (!password) {
            setPasswordFocused(false);
            Animated.timing(passwordLabelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
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

    const handleLogin = async () => {
        animateButton();

        let newErrors = { email: '', password: '' };
        let hasError = false;

        if (!email) {
            newErrors.email = 'Email is required';
            hasError = true;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
            hasError = true;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) {
            return;
        }

        setLoading(true);
        try {
            const response = await loginUser({
                email,
                password
            });

            if (response.success && response.data) {
                await SecureStore.setItemAsync('userToken', response.data.token);
                // In a real app, you would store the token here
                router.push('/home');
            } else {
                setErrorMessage(response.message || 'Invalid credentials');
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Login error details:', error);
            setErrorMessage('Failed to connect to server. Please check your internet connection.');
            setShowErrorModal(true);
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
                <View style={styles.content}>
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
                                <Ionicons name="lock-closed" size={48} color="#A78BFA" />
                            </Animated.View>
                        </Animated.View>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
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
                                Email
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
                                    onFocus={handleEmailFocus}
                                    onBlur={handleEmailBlur}
                                    placeholder={!emailFocused ? "Email" : ""}
                                    placeholderTextColor="#8F92A1"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                />
                            </View>
                            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
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
                                Password
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
                                    onFocus={handlePasswordFocus}
                                    onBlur={handlePasswordBlur}
                                    placeholder={!passwordFocused ? "Password" : ""}
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

                        {/* Login Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }, { scale: pulseAnim }] }}>
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.loginButton}
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
                                            <Text style={styles.loginButtonText}>Log In</Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Sign Up Link */}
                        <Text style={styles.signupText}>
                            Don't have an account? <Text style={styles.signupLink} onPress={() => router.push('/register')}>Sign up</Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Error Modal */}
            <Modal
                visible={showErrorModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.errorIcon}>
                            <Ionicons name="close-circle" size={80} color="#FF4B4B" />
                        </View>
                        <Text style={styles.errorTitle}>Login Failed</Text>
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowErrorModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
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
        marginBottom: 24,
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
    loginButton: {
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
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    signupText: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    signupLink: {
        color: '#A78BFA',
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E2238',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        width: '85%',
        borderWidth: 2,
        borderColor: 'rgba(255, 75, 75, 0.3)',
    },
    errorIcon: {
        marginBottom: 24,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    errorMessage: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    closeButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 60,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
