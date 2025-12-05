import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser } from '../src/api/client';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
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

            if (response.success) {
                // In a real app, you would store the token here
                router.push('/home');
            } else {
                Alert.alert('Login Failed', response.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error details:', error);
            Alert.alert('Error', 'Failed to connect to server. Please check your internet connection and ensure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Ionicons name="log-in" size={80} color="#A78BFA" />
                </View>

                {/* Title */}
                <Text style={styles.title}>Welcome!</Text>

                {/* Email Input */}
                <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
                    <Ionicons name="mail-outline" size={20} color="#8F92A1" style={styles.icon} />
                    <TextInput
                        value={email}
                        onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: '' }); }}
                        placeholder="Email"
                        placeholderTextColor="#8F92A1"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                {/* Password Input */}
                <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
                    <Ionicons name="lock-closed-outline" size={20} color="#8F92A1" style={styles.icon} />
                    <TextInput
                        value={password}
                        onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: '' }); }}
                        placeholder="Password"
                        placeholderTextColor="#8F92A1"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.loginButtonText}>Log In</Text>
                    )}
                </TouchableOpacity>

                {/* Sign Up Link */}
                <Text style={styles.signupText}>
                    Don't have an account? <Text style={styles.signupLink} onPress={() => router.push('/register')}>Sign up</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2238',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(143, 146, 161, 0.3)',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginBottom: 16,
    },
    inputError: {
        borderColor: '#FF4B4B',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF4B4B',
        fontSize: 12,
        marginLeft: 20,
        marginTop: -12,
        marginBottom: 12,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
    },
    signupLink: {
        color: '#A78BFA',
        fontWeight: 'bold',
    },
});
