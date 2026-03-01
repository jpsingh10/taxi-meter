import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useThemeColors, spacing, borderRadius, typography } from '../theme';

interface Props {
    onPermissionGranted: () => void;
}

export function LocationPermission({ onPermissionGranted }: Props) {
    const colors = useThemeColors();
    const styles = createStyles(colors);
    const handleRequest = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            onPermissionGranted();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Ionicons name="location" size={48} color={colors.primary.default} />
            </View>
            <Text style={styles.title}>Location Access Needed</Text>
            <Text style={styles.description}>
                TaxiMeter needs your location to track ride distance and calculate
                fares accurately. Your location data stays on your device.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleRequest}>
                <Text style={styles.buttonText}>Enable Location</Text>
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['3xl'],
        backgroundColor: colors.background.primary,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.primary.muted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing['2xl'],
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing['3xl'],
    },
    button: {
        backgroundColor: colors.primary.default,
        paddingHorizontal: spacing['3xl'],
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonText: {
        ...typography.button,
        color: colors.text.inverse,
    },
});
