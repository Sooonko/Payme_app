import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface LoanItem {
    id: string;
    title: string;
    duration: string;
    amount: string;
    buttonText: string;
}

const LOAN_DATA: LoanItem[] = [
    { id: '1', title: 'Богино хугацаат', duration: '-', amount: '10,000,000₮ хүртэл', buttonText: 'Зээл авах' },
    { id: '2', title: 'Урт хугацаат', duration: '3-18 сар', amount: '35,000,000₮ хүртэл', buttonText: 'Зээл авах' },
    { id: '5', title: 'Автомашины зээл', duration: '6-36 сар', amount: '35,000,000₮ хүртэл', buttonText: 'Зээл авах' },
    { id: '6', title: 'Итгэлцэл барьцаалсан зээл', duration: '-', amount: '120,000,000₮ хүртэл', buttonText: 'Зээл авах' },
];

const BANNER_DATA = [
    { id: 1, title: "Зээлийн эрхээ нэмээрэй", subtitle: "Таны зээлийн эрх 10,000,000₮ хүртэл нэмэгдэх боломжтой.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Шуурхай зээл", subtitle: "5 минутын дотор зээлээ аваарай.", image: "https://images.unsplash.com/photo-1579621970795-87f967b16cf8?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Ухаалаг санхүү", subtitle: "Бага хүүтэй, уян хатан нөхцөлтэй зээлүүд.", image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=800&auto=format&fit=crop" }
];

export default function Loan() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [bannerIndex, setBannerIndex] = useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
        setBannerIndex(index);
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const renderLoanCard = (item: LoanItem) => (
        <BlurView intensity={25} tint="light" style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.durationRow}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.durationText}>{item.duration}</Text>
            </View>

            <Text style={styles.amountLabel}>Боломжит хэмжээ</Text>
            <Text style={styles.amountText}>{item.amount}</Text>

            <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
        </BlurView>
    );

    return (
        <LinearGradient
            colors={['#1a1642', '#221a52', '#311a63', '#421a52', '#4a1a4a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Background Glows matching home.tsx */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={[styles.glow, { top: '5%', left: '-15%', backgroundColor: '#4F46E5', width: 400, height: 400, opacity: 0.18 }]} />
                <View style={[styles.glow, { top: '35%', right: '-25%', backgroundColor: '#4f7abdff', width: 350, height: 350, opacity: 0.15 }]} />
                <View style={[styles.glow, { bottom: '5%', right: '-15%', backgroundColor: '#ae4479ff', width: 380, height: 380, opacity: 0.18 }]} />
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Зээл</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Banner Section */}
                    <View style={styles.bannerWrapper}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.bannerContainer}
                            style={styles.bannerScroll}
                            pagingEnabled
                            decelerationRate="fast"
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                        >
                            {BANNER_DATA.map((item) => (
                                <BlurView key={item.id} intensity={25} tint="light" style={styles.bannerItem}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}
                                        contentFit="cover"
                                    />
                                    <View style={styles.bannerOverlay} />
                                    <View style={styles.bannerContent}>
                                        <View style={styles.bannerTextContainer}>
                                            <Text style={styles.bannerTitle}>{item.title}</Text>
                                            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                                        </View>
                                    </View>
                                </BlurView>
                            ))}
                        </ScrollView>

                        {/* Pagination Dots */}
                        <View style={styles.paginationContainer}>
                            {BANNER_DATA.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        index === bannerIndex && styles.paginationDotActive
                                    ]}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.grid}>
                        {LOAN_DATA.map((item) => (
                            <View key={item.id} style={styles.cardWrapper}>
                                {renderLoanCard(item)}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    glow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.25,
        filter: 'blur(80px)',
    },
    content: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 110,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48.5%',
        marginBottom: 15,
    },
    card: {
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
        height: 220, // Increased height to prevent cut-off
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
        height: 40, // Reduced from 45
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8, // Reduced from 12
    },
    durationText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    amountLabel: {
        fontSize: 12,
        color: '#34D399',
        fontWeight: '600',
        marginBottom: 4,
    },
    amountText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
        opacity: 0.9,
    },
    actionButton: {
        backgroundColor: '#E11D48',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 'auto',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
    },
    bannerWrapper: {
        marginBottom: 25,
        alignItems: 'center',
    },
    bannerScroll: {
        width: width - 30,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    bannerContainer: {
        paddingHorizontal: 0,
    },
    bannerItem: {
        width: width - 32,
        height: 160,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bannerContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
    },
    bannerTextContainer: {
        width: '100%',
    },
    bannerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    bannerSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        lineHeight: 18,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    paginationDotActive: {
        width: 20,
        backgroundColor: 'white',
    },
});
