import { StyleSheet, Text, View } from 'react-native';

export default function Activity() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Activity</Text>
            <Text style={styles.subtitle}>Transaction history coming soon...</Text>
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
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
    },
});
