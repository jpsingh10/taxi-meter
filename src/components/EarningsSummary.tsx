import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, borderRadius, typography } from '../theme';

interface Props {
    todayEarnings: number;
    weekEarnings: number;
    totalRides: number;
    currencySymbol: string;
}

export function EarningsSummary({
    todayEarnings,
    weekEarnings,
    totalRides,
    currencySymbol,
}: Props) {
    const colors = useThemeColors();
    const styles = createStyles(colors);
    return (
        <View style={styles.container}>
            <View style={styles.stat}>
                <Ionicons name="today" size={18} color={colors.primary.default} />
                <Text style={styles.amount}>
                    {currencySymbol}{todayEarnings.toFixed(2)}
                </Text>
                <Text style={styles.label}>TODAY</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
                <Ionicons name="calendar" size={18} color={colors.primary.default} />
                <Text style={styles.amount}>
                    {currencySymbol}{weekEarnings.toFixed(2)}
                </Text>
                <Text style={styles.label}>THIS WEEK</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
                <Ionicons name="car" size={18} color={colors.primary.default} />
                <Text style={styles.amount}>{totalRides}</Text>
                <Text style={styles.label}>RIDES</Text>
            </View>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
        marginBottom: spacing.lg,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
        gap: spacing.xs,
    },
    amount: {
        ...typography.h2,
        color: colors.text.primary,
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
