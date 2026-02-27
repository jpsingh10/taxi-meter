import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FareBreakdown as FareBreakdownType } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
    breakdown: FareBreakdownType;
    totalFare: number;
    distanceMiles: number;
    waitingTimeSeconds: number;
    currencySymbol: string;
    perMileRate: number;
    waitingRatePerMinute: number;
}

export function FareBreakdown({
    breakdown,
    totalFare,
    distanceMiles,
    waitingTimeSeconds,
    currencySymbol,
    perMileRate,
    waitingRatePerMinute,
}: Props) {
    const waitingMinutes = waitingTimeSeconds / 60;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fare Breakdown</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Base Fare</Text>
                <Text style={styles.amount}>
                    {currencySymbol}{breakdown.baseFare.toFixed(2)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Distance ({distanceMiles.toFixed(2)} mi × {currencySymbol}{perMileRate.toFixed(2)})
                </Text>
                <Text style={styles.amount}>
                    {currencySymbol}{breakdown.distanceCharge.toFixed(2)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Waiting ({waitingMinutes.toFixed(1)} min × {currencySymbol}{waitingRatePerMinute.toFixed(2)})
                </Text>
                <Text style={styles.amount}>
                    {currencySymbol}{breakdown.waitingCharge.toFixed(2)}
                </Text>
            </View>

            <View style={styles.totalDivider} />

            <View style={styles.row}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                    {currencySymbol}{totalFare.toFixed(2)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    title: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    label: {
        ...typography.body,
        color: colors.text.secondary,
        flex: 1,
    },
    amount: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '600',
    },
    totalDivider: {
        height: 1,
        backgroundColor: colors.border.light,
        marginVertical: spacing.md,
    },
    totalLabel: {
        ...typography.h2,
        color: colors.text.primary,
    },
    totalAmount: {
        ...typography.h2,
        color: colors.primary.default,
    },
});
