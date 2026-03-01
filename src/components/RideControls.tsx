import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FareProfile, MeterStatus } from '../types';
import { useThemeColors, spacing, borderRadius, typography } from '../theme';

interface Props {
    meterStatus: MeterStatus;
    profiles: FareProfile[];
    selectedProfile: FareProfile | null;
    onStart: (profile: FareProfile) => void;
    onStop: () => void;
}

export function RideControls({
    meterStatus,
    profiles,
    selectedProfile,
    onStart,
    onStop,
}: Props) {
    const [profileIndex, setProfileIndex] = useState(0);
    const colors = useThemeColors();
    const styles = createStyles(colors);

    const defaultIndex = profiles.findIndex((p) => p.isDefault);
    const activeIndex = defaultIndex >= 0 ? defaultIndex : 0;
    const currentProfile = profiles[profileIndex] ?? profiles[activeIndex] ?? profiles[0];

    const cycleProfile = () => {
        if (profiles.length <= 1) return;
        setProfileIndex((prev) => (prev + 1) % profiles.length);
    };

    if (meterStatus === 'running') {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.stopButton}
                    onPress={onStop}
                    activeOpacity={0.8}
                >
                    <Ionicons name="stop" size={28} color={colors.text.primary} />
                    <Text style={styles.stopText}>END RIDE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Profile selector */}
            {profiles.length > 0 && (
                <TouchableOpacity style={styles.profileSelector} onPress={cycleProfile}>
                    <Ionicons name="pricetag" size={16} color={colors.primary.default} />
                    <Text style={styles.profileName}>
                        {currentProfile?.name ?? 'Standard'}
                    </Text>
                    {profiles.length > 1 && (
                        <Ionicons
                            name="chevron-forward"
                            size={14}
                            color={colors.text.muted}
                        />
                    )}
                </TouchableOpacity>
            )}

            {/* Start button */}
            <TouchableOpacity
                style={styles.startButton}
                onPress={() => currentProfile && onStart(currentProfile)}
                activeOpacity={0.8}
                disabled={!currentProfile}
            >
                <Ionicons name="play" size={28} color={colors.text.inverse} />
                <Text style={styles.startText}>START RIDE</Text>
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        gap: spacing.md,
        paddingTop: spacing.lg,
    },
    profileSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primary.muted,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignSelf: 'center',
    },
    profileName: {
        ...typography.body,
        color: colors.primary.default,
        fontWeight: '600',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        backgroundColor: colors.primary.default,
        paddingVertical: spacing.xl,
        borderRadius: borderRadius.lg,
        minHeight: 64,
    },
    startText: {
        ...typography.button,
        color: colors.text.inverse,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        backgroundColor: colors.danger,
        paddingVertical: spacing.xl,
        borderRadius: borderRadius.lg,
        minHeight: 64,
    },
    stopText: {
        ...typography.button,
        color: colors.text.primary,
    },
});
