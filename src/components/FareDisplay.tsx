import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useThemeColors, spacing, typography } from '../theme';

interface Props {
    fare: number;
    currencySymbol: string;
}

export function FareDisplay({ fare, currencySymbol }: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const prevFare = useRef(fare);
    const colors = useThemeColors();
    const styles = createStyles(colors);

    // Subtle bounce when fare changes
    useEffect(() => {
        if (fare !== prevFare.current) {
            prevFare.current = fare;
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [fare, scaleAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Text style={styles.fare}>
                    {currencySymbol}{fare.toFixed(2)}
                </Text>
            </Animated.View>
            <Text style={styles.label}>CURRENT FARE</Text>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing['3xl'],
    },
    fare: {
        ...typography.display,
        color: colors.text.primary,
    },
    label: {
        ...typography.label,
        color: colors.text.muted,
        marginTop: spacing.sm,
    },
});
