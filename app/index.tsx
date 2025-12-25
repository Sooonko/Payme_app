import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Index() {
    const { t } = useTranslation();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideInAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideInAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous pulse animation for button
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const slides = [
        {
            icon: 'flash',
            title: t('landing.features.fastTransfer.title'),
            description: t('landing.features.fastTransfer.desc'),
            color: '#A78BFA',
            tagline: t('landing.tagline'),
        },
        {
            icon: 'shield-checkmark',
            title: t('landing.features.securePayment.title'),
            description: t('landing.features.securePayment.desc'),
            color: '#60A5FA',
            tagline: t('landing.tagline'),
        },
        {
            icon: 'wallet',
            title: t('landing.features.easyTopUp.title'),
            description: t('landing.features.easyTopUp.desc'),
            color: '#34D399',
            tagline: t('landing.tagline'),
        },
    ];

    const handleScroll = (event: any) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollOffset / width);
        if (index !== activeIndex) {
            setActiveIndex(index);
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

            {/* Logo/Header */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <Image
                    source={require('../assets/logo/logo.png')}
                    style={styles.landingLogo}
                    contentFit="contain"
                />
            </Animated.View>

            {/* Slider Content */}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {slides.map((slide, index) => (
                    <View key={index} style={styles.slide}>
                        <Animated.View
                            style={[
                                styles.slideContent,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideInAnim }],
                                }
                            ]}
                        >
                            <View style={[styles.iconBox, { backgroundColor: slide.color + '20' }]}>
                                <Ionicons name={slide.icon as any} size={80} color={slide.color} />
                            </View>
                            <Text style={styles.slideTitle}>{slide.title}</Text>
                            <Text style={styles.slideDescription}>{slide.description}</Text>
                            <Text style={styles.slideTagline}>{slide.tagline}</Text>
                        </Animated.View>
                    </View>
                ))}
            </ScrollView>

            {/* Footer Section */}
            <View style={styles.footer}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.activeDot
                            ]}
                        />
                    ))}
                </View>

                {/* Always visible button */}
                <Animated.View
                    style={{
                        transform: [{ scale: pulseAnim }],
                        width: '100%',
                    }}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/login')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>{t('landing.getStarted')}</Text>
                            <Ionicons name="arrow-forward" size={22} color="white" style={styles.buttonIcon} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={styles.joinText}>{t('landing.join')}</Text>
                </Animated.View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.12,
    },
    landingLogo: {
        width: 200,
        height: 70,
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.3)',
    },
    brandTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1.5,
    },
    scrollView: {
        flex: 1,
    },
    slide: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    slideContent: {
        alignItems: 'center',
    },
    iconBox: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    slideTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    slideDescription: {
        fontSize: 20,
        color: '#A78BFA',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    slideTagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: height * 0.06,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 40,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    activeDot: {
        width: 24,
        backgroundColor: '#A78BFA',
    },
    button: {
        borderRadius: 25,
        width: '100%',
        backgroundColor: '#A78BFA',
        elevation: 10,
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        marginBottom: 24,
        paddingVertical: 20,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonIcon: {
        marginLeft: 2,
    },
    joinText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '500',
    },
});

