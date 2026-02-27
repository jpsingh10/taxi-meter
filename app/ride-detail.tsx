import { View, Text, StyleSheet } from 'react-native';

export default function RideDetailScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ride Details</Text>
            <Text style={styles.subtitle}>Full ride information will appear here</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#6B7280',
        fontSize: 16,
    },
});
