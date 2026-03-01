import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FareProfile } from '../types';
import { useThemeColors, spacing, borderRadius, typography } from '../theme';

interface Props {
    profile: FareProfile;
    currencySymbol: string;
    onEdit: (profile: FareProfile) => void;
    onDelete: (profile: FareProfile) => void;
    onSetDefault: (profile: FareProfile) => void;
}

export function FareProfileCard({
    profile,
    currencySymbol,
    onEdit,
    onDelete,
    onSetDefault,
}: Props) {
    const colors = useThemeColors();
    const styles = createStyles(colors);
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.name}>{profile.name}</Text>
                    {profile.isDefault && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>DEFAULT</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actions}>
                    {!profile.isDefault && (
                        <TouchableOpacity
                            onPress={() => onSetDefault(profile)}
                            style={styles.actionBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="star-outline" size={18} color={colors.text.muted} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => onEdit(profile)}
                        style={styles.actionBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="pencil" size={18} color={colors.text.muted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onDelete(profile)}
                        style={styles.actionBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.rates}>
                <View style={styles.rateItem}>
                    <Text style={styles.rateLabel}>BASE</Text>
                    <Text style={styles.rateValue}>
                        {currencySymbol}{profile.baseFare.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.rateItem}>
                    <Text style={styles.rateLabel}>PER MILE</Text>
                    <Text style={styles.rateValue}>
                        {currencySymbol}{profile.perMileRate.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.rateItem}>
                    <Text style={styles.rateLabel}>WAITING/MIN</Text>
                    <Text style={styles.rateValue}>
                        {currencySymbol}{profile.waitingRatePerMinute.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    name: {
        ...typography.h3,
        color: colors.text.primary,
    },
    badge: {
        backgroundColor: colors.primary.muted,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    badgeText: {
        ...typography.caption,
        color: colors.primary.default,
        fontWeight: '700',
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionBtn: {
        padding: spacing.xs,
    },
    rates: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rateItem: {
        flex: 1,
        alignItems: 'center',
    },
    rateLabel: {
        ...typography.caption,
        color: colors.text.muted,
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    rateValue: {
        ...typography.h3,
        color: colors.text.primary,
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: colors.border.default,
    },
});
