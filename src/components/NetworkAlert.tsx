import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNetwork } from '../contexts/NetworkContext';

export const NetworkAlert: React.FC = () => {
    const { isConnected, isServerReachable, refresh } = useNetwork();
    const [slideAnim] = useState(new Animated.Value(-100));
    const [isRefreshing, setIsRefreshing] = useState(false);

    const showAlert = !isConnected || !isServerReachable;

    useEffect(() => {
        if (showAlert) {
            // Slide down
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        } else {
            // Slide up
            Animated.spring(slideAnim, {
                toValue: -100,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        }
    }, [showAlert, slideAnim]);

    const handleRetry = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (!showAlert) {
        return null;
    }

    const isOffline = !isConnected;
    const backgroundColor = isOffline ? '#EF4444' : '#F59E0B';
    const icon = isOffline ? 'cloud-offline' : 'server';
    const message = isOffline
        ? 'Интернэт холболт салсан байна'
        : 'Сервертэй холбогдож чадахгүй байна';

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={styles.content}>
                <Ionicons name={icon} size={20} color="#FFFFFF" />
                <Text style={styles.message}>{message}</Text>
            </View>
            <TouchableOpacity
                onPress={handleRetry}
                style={styles.retryButton}
                disabled={isRefreshing}
            >
                <Ionicons
                    name="refresh"
                    size={20}
                    color="#FFFFFF"
                    style={isRefreshing ? styles.spinning : undefined}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50, // Account for status bar
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    message: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1,
    },
    retryButton: {
        padding: 4,
    },
    spinning: {
        // Animation would be handled by a rotation animation if needed
    },
});
