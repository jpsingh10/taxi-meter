import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { DistanceUnit } from '../types';
import { milesToKm } from '../engine/geoUtils';

interface Props {
    distanceMiles: number;
    movingTimeSeconds: number;
    waitingTimeSeconds: number;
    distanceUnit: DistanceUnit;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function MeterStats({
    distanceMiles,
    movingTimeSeconds,
    waitingTimeSeconds,
    distanceUnit,
}: Props) {
    const displayDistance =
        distanceUnit === 'km' ? milesToKm(distanceMiles) : distanceMiles;
    const unitLabel = distanceUnit === 'km' ? 'km' : 'mi';

    return (
        <View style={styles.container}>
            <View style={styles.stat}>
                <Text style={styles.value}>
                    {displayDistance.toFixed(2)}
                </Text>
                <Text style={styles.label}>DISTANCE ({unitLabel})</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
                <Text style={styles.value}>
                    {formatTime(movingTimeSeconds)}
                </Text>
                <Text style={styles.label}>MOVING</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
                <Text style={[styles.value, waitingTimeSeconds > 0 && styles.waitingValue]}>
                    {formatTime(waitingTimeSeconds)}
                </Text>
                <Text style={styles.label}>WAITING</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
        gap: spacing.xs,
    },
    value: {
        ...typography.h2,
        color: colors.text.primary,
    },
    waitingValue: {
        color: colors.warning,
    },
    label: {
        ...typography.caption,
        color: colors.text.muted,
        letterSpacing: 0.5,
    },
    divider: {
        width: 1,
        backgroundColor: colors.border.default,
        marginHorizontal: spacing.sm,
    },
});
