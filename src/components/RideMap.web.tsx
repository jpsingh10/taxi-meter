import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoutePoint, MovementStatus } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
    routePoints: RoutePoint[];
    currentLocation: RoutePoint | null;
    movementStatus: MovementStatus;
    isLive: boolean;
}

/**
 * Web fallback for RideMap — react-native-maps doesn't support web.
 * Shows a placeholder with route point count.
 */
export function RideMap({ routePoints, movementStatus, isLive }: Props) {
    return (
        <View style={styles.container}>
            <Ionicons name="map-outline" size={48} color={colors.text.muted} />
            <Text style={styles.text}>Map unavailable on web</Text>
            {isLive && (
                <Text style={styles.detail}>
                    {routePoints.length} points tracked •{' '}
                    {movementStatus === 'moving' ? '🟢 Moving' : '🟡 Waiting'}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        gap: spacing.md,
        minHeight: 200,
    },
    text: {
        ...typography.body,
        color: colors.text.muted,
    },
    detail: {
        ...typography.caption,
        color: colors.text.secondary,
    },
});
