import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type NewsCategory = 'all' | 'news' | 'comment';

interface NewsItem {
    id: string;
    category: NewsCategory;
    title: string;
    description: string;
    date: string;
    image?: string;
}

const NEWS_DATA: NewsItem[] = [
    {
        id: '1',
        category: 'news',
        title: 'Шинэ үйлчилгээ нэвтэрлээ',
        description: 'Та одооноос зээлээ шууд апп-аараа дамжуулан авах боломжтой боллоо.',
        date: '2023.12.19',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80'
    },
    {
        id: '2',
        category: 'comment',
        title: 'Хэрэглэгчийн сэтгэгдэл',
        description: 'Маш хурдан бөгөөд амархан үйлчилгээ байна. Баярлалаа!',
        date: '2023.12.18'
    },
    {
        id: '3',
        category: 'news',
        title: 'Системийн шинэчлэл',
        description: 'Аюулгүй байдлыг хангах үүднээс системд шинэчлэл хийгдэж байна.',
        date: '2023.12.17',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80'
    },
    {
        id: '4',
        category: 'comment',
        title: 'Санал хүсэлт',
        description: 'Цаашид улам олон боломжууд нэмэгдэнэ гэдэгт итгэлтэй байна.',
        date: '2023.12.16'
    },
];

export default function News() {
    const [activeTab, setActiveTab] = useState<NewsCategory>('all');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const filteredData = activeTab === 'all'
        ? NEWS_DATA
        : NEWS_DATA.filter(item => item.category === activeTab);

    const renderNewsCard = ({ item }: { item: NewsItem }) => (
        <BlurView intensity={25} tint="light" style={styles.card}>
            {item.image && (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
            )}
            <View style={styles.cardContent}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardFooter}>
                    <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.cardDate}>{item.date}</Text>
                </View>
            </View>
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
                    <Text style={styles.headerTitle}>Мэдээлэл</Text>
                </View>

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <BlurView intensity={30} tint="light" style={styles.tabBar}>
                        {(['all', 'news', 'comment'] as const).map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                    {tab === 'all' ? 'Бүгд' : tab === 'news' ? 'Мэдээ' : 'Сэтгэгдэл'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </BlurView>
                </View>

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNewsCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Одоогоор мэдээлэл байхгүй байна.</Text>
                        </View>
                    }
                />
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
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tabBar: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 5,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 15,
    },
    activeTabButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    tabText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
    activeTabText: {
        color: 'white',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 110,
    },
    card: {
        borderRadius: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 16,
    },
    categoryBadge: {
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#818CF8',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 20,
        marginBottom: 15,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardDate: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
    },
});
