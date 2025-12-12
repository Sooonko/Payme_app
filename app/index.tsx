import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Index() {
    const router = useRouter();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous pulse animation for button
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const features = [
        {
            icon: 'flash',
            title: 'Fast Transfers',
            description: 'Instant money transfers',
            color: '#A78BFA',
        },
        {
            icon: 'shield-checkmark',
            title: 'Secure Payments',
            description: 'Bank-level security',
            color: '#60A5FA',
        },
        {
            icon: 'wallet',
            title: 'Easy Top-up',
            description: 'Multiple payment options',
            color: '#34D399',
        },
    ];

    return (
        <LinearGradient
            colors={['#1E1B4B', '#312E81', '#4C1D95', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Animated Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                <View style={styles.logoContainer}>
                    <Ionicons name="card" size={48} color="#A78BFA" />
                </View>
                <Text style={styles.title}>PAYME</Text>
                <Text style={styles.subtitle}>Your Digital Wallet</Text>
                <Text style={styles.tagline}>Fast, Secure & Simple Payments</Text>
            </Animated.View>

            {/* Feature Cards */}
            <Animated.View
                style={[
                    styles.featuresContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
            >
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureCard}>
                        <View style={[styles.iconCircle, { backgroundColor: feature.color + '20' }]}>
                            <Ionicons name={feature.icon as any} size={28} color={feature.color} />
                        </View>
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                ))}
            </Animated.View>

            {/* CTA Button */}
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: pulseAnim }],
                }}
            >
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/login')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={styles.footerText}>Join thousands of happy users</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    title: {
        fontSize: 56,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 2,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#A78BFA',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '400',
    },
    featuresContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginVertical: 20,
    },
    featureCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 6,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
        marginBottom: 6,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: 16,
    },
    button: {
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
        paddingVertical: 18,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '500',
    },
});
