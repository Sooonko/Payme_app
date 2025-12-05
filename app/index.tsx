import { useRouter } from 'expo-router';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.text}>Payme</Text>

            {/* Get Started Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/login')}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E2238',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 64,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 60,
    },
    button: {
        backgroundColor: '#A78BFA',
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
