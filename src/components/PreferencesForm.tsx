import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Preferences } from '../types';
import { useThemeColors, spacing, borderRadius, typography } from '../theme';

interface Props {
    preferences: Preferences;
    onUpdate: (updates: Partial<Preferences>) => void;
}

export function PreferencesForm({ preferences, onUpdate }: Props) {
    const colors = useThemeColors();
    const styles = createStyles(colors);
    const adjustThreshold = (delta: number) => {
        const newVal = Math.max(1, Math.min(15, preferences.speedThresholdMph + delta));
        onUpdate({ speedThresholdMph: newVal });
    };

    return (
        <View style={styles.container}>
            {/* Distance Unit */}
            <View style={styles.field}>
                <Text style={styles.label}>DISTANCE UNIT</Text>
                <View style={styles.segmented}>
                    <TouchableOpacity
                        style={[
                            styles.segment,
                            preferences.distanceUnit === 'miles' && styles.segmentActive,
                        ]}
                        onPress={() => onUpdate({ distanceUnit: 'miles' })}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                preferences.distanceUnit === 'miles' && styles.segmentTextActive,
                            ]}
                        >
                            Miles
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.segment,
                            preferences.distanceUnit === 'km' && styles.segmentActive,
                        ]}
                        onPress={() => onUpdate({ distanceUnit: 'km' })}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                preferences.distanceUnit === 'km' && styles.segmentTextActive,
                            ]}
                        >
                            Kilometers
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Currency Symbol */}
            <View style={styles.field}>
                <Text style={styles.label}>CURRENCY SYMBOL</Text>
                <TextInput
                    style={styles.input}
                    value={preferences.currencySymbol}
                    onChangeText={(text) => onUpdate({ currencySymbol: text })}
                    placeholder="$"
                    placeholderTextColor={colors.text.muted}
                    maxLength={3}
                />
            </View>

            {/* Speed Threshold — stepper instead of slider */}
            <View style={styles.field}>
                <Text style={styles.label}>WAITING SPEED THRESHOLD</Text>
                <Text style={styles.hint}>
                    Below this speed, the meter charges waiting rate
                </Text>
                <View style={styles.stepperRow}>
                    <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustThreshold(-1)}
                    >
                        <Ionicons name="remove" size={22} color={colors.text.primary} />
                    </TouchableOpacity>
                    <View style={styles.stepperValue}>
                        <Text style={styles.stepperNumber}>
                            {preferences.speedThresholdMph}
                        </Text>
                        <Text style={styles.stepperUnit}>MPH</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustThreshold(1)}
                    >
                        <Ionicons name="add" size={22} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Driver Name */}
            <View style={styles.field}>
                <Text style={styles.label}>DRIVER NAME (FOR RECEIPTS)</Text>
                <TextInput
                    style={styles.input}
                    value={preferences.driverName}
                    onChangeText={(text) => onUpdate({ driverName: text })}
                    placeholder="Optional — appears on receipts"
                    placeholderTextColor={colors.text.muted}
                />
            </View>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        gap: spacing.lg,
    },
    field: {
        gap: spacing.sm,
    },
    label: {
        ...typography.label,
        color: colors.text.muted,
    },
    hint: {
        ...typography.caption,
        color: colors.text.muted,
        marginTop: -spacing.xs,
    },
    input: {
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        color: colors.text.primary,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    segmented: {
        flexDirection: 'row',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.md,
        padding: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    segment: {
        flex: 1,
        padding: spacing.md,
        alignItems: 'center',
        borderRadius: borderRadius.sm,
    },
    segmentActive: {
        backgroundColor: colors.primary.muted,
    },
    segmentText: {
        ...typography.body,
        color: colors.text.muted,
        fontWeight: '600',
    },
    segmentTextActive: {
        color: colors.primary.default,
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
    },
    stepperBtn: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    stepperValue: {
        alignItems: 'center',
        minWidth: 60,
    },
    stepperNumber: {
        ...typography.h1,
        color: colors.primary.default,
    },
    stepperUnit: {
        ...typography.caption,
        color: colors.text.muted,
    },
});
