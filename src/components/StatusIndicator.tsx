import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MeterStatus, MovementStatus } from '../types';
import { useThemeColors, spacing, borderRadius, typography } from '../theme';

interface Props {
    meterStatus: MeterStatus;
    movementStatus: MovementStatus;
}

export function StatusIndicator({ meterStatus, movementStatus }: Props) {
    const colors = useThemeColors();
    const styles = createStyles(colors);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const statusConfig = {
        idle: { label: 'IDLE', color: colors.status.idle },
        moving: { label: 'MOVING', color: colors.status.moving },
        waiting: { label: 'WAITING', color: colors.status.waiting },
        stopped: { label: 'STOPPED', color: colors.status.stopped },
    };

    const config =
        meterStatus === 'running'
            ? statusConfig[movementStatus]
            : statusConfig[meterStatus === 'stopped' ? 'stopped' : 'idle'];

    // Pulsing animation when ride is active
    useEffect(() => {
        if (meterStatus === 'running') {
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.4,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
            return () => animation.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [meterStatus, pulseAnim]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.dot,
                    { backgroundColor: config.color, opacity: pulseAnim },
                ]}
            />
            <Text style={[styles.label, { color: config.color }]}>
                {config.label}
            </Text>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    label: {
        ...typography.label,
        fontWeight: '700',
    },
});
