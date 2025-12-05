import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerUser } from '../src/api/client';

export default function Register() {
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

    const handleRegister = async () => {
        let newErrors = { name: '', email: '', phone: '', password: '' };
        let hasError = false;

        if (!name) {
            newErrors.name = 'Full Name is required';
            hasError = true;
        }

        if (!email) {
            newErrors.email = 'Email is required';
            hasError = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Please enter a valid email address';
                hasError = true;
            }
        }

        if (!phoneNumber) {
            newErrors.phone = 'Phone Number is required';
            hasError = true;
        } else if (phoneNumber.length !== 8 || !/^\d+$/.test(phoneNumber)) {
            newErrors.phone = 'Phone number must be exactly 8 digits';
            hasError = true;
        }

        if (!password) {
            newErrors.password = 'Password is required';
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
                Alert.alert('Success', 'Account created successfully!', [
                    { text: 'OK', onPress: () => router.push('/home') }
                ]);
            } else {
                Alert.alert('Registration Failed', response.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Registration error details:', error);
            Alert.alert('Error', 'Failed to connect to server. Please check your internet connection and ensure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Ionicons name="person-add" size={80} color="#A78BFA" />
                </View>

                {/* Title */}
                <Text style={styles.title}>Create Account</Text>

                {/* Name Input */}
                <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
                    <Ionicons name="person-outline" size={20} color="#8F92A1" style={styles.icon} />
                    <TextInput
                        value={name}
                        onChangeText={(text) => { setName(text); setErrors({ ...errors, name: '' }); }}
                        placeholder="Full Name"
                        placeholderTextColor="#8F92A1"
                        style={styles.input}
                    />
                </View>
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

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

                {/* Phone Number Input */}
                <View style={[styles.inputContainer, errors.phone ? styles.inputError : null]}>
                    <Ionicons name="call-outline" size={20} color="#8F92A1" style={styles.icon} />
                    <TextInput
                        value={phoneNumber}
                        onChangeText={(text) => { setPhoneNumber(text); setErrors({ ...errors, phone: '' }); }}
                        placeholder="Phone Number"
                        placeholderTextColor="#8F92A1"
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                </View>
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

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

                {/* Register Button */}
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.registerButtonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                {/* Login Link */}
                <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginLink} onPress={() => router.push('/login')}>Log in</Text>
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2238',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 40,
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
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#A78BFA',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
    },
    loginLink: {
        color: '#A78BFA',
        fontWeight: 'bold',
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
});
