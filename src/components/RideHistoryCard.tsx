import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RideRecord } from '../types';
import { useThemeColors, spacing, borderRadius, typography } from '../theme';

interface Props {
    ride: RideRecord;
    currencySymbol: string;
    onPress: (ride: RideRecord) => void;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hrs}h ${remainMins}m`;
}

export function RideHistoryCard({ ride, currencySymbol, onPress }: Props) {
    const date = new Date(ride.startTime);
    const totalSeconds = ride.movingTimeSeconds + ride.waitingTimeSeconds;
    const colors = useThemeColors();
    const styles = createStyles(colors);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(ride)}
            activeOpacity={0.7}
        >
            <View style={styles.left}>
                <Text style={styles.date}>
                    {date.toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                    })}
                </Text>
                <Text style={styles.time}>
                    {date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>

            <View style={styles.center}>
                <Text style={styles.distance}>
                    {ride.distanceMiles.toFixed(1)} mi
                </Text>
                <Text style={styles.duration}>{formatDuration(totalSeconds)}</Text>
            </View>

            <View style={styles.right}>
                <Text style={styles.fare}>
                    {currencySymbol}{ride.totalFare.toFixed(2)}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
            </View>
        </TouchableOpacity>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    left: {
        width: 70,
    },
    date: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '600',
    },
    time: {
        ...typography.caption,
        color: colors.text.muted,
    },
    center: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    distance: {
        ...typography.body,
        color: colors.text.secondary,
    },
    duration: {
        ...typography.caption,
        color: colors.text.muted,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    fare: {
        ...typography.h3,
        color: colors.primary.default,
    },
});
