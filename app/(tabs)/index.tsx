import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMeter } from '../../src/context/MeterContext';
import { StatusIndicator } from '../../src/components/StatusIndicator';
import { FareDisplay } from '../../src/components/FareDisplay';
import { MeterStats } from '../../src/components/MeterStats';
import { RideControls } from '../../src/components/RideControls';
import { colors, spacing } from '../../src/theme';

export default function MeterScreen() {
    const { state, preferences, profiles, startRide, stopRide, resetMeter } =
        useMeter();
    const router = useRouter();

    const handleStop = () => {
        const ride = stopRide();
        router.push({
            pathname: '/ride-summary',
            params: { rideId: ride.id },
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Status */}
                <StatusIndicator
                    meterStatus={state.status}
                    movementStatus={state.movementStatus}
                />

                {/* Fare */}
                <FareDisplay
                    fare={state.currentFare}
                    currencySymbol={preferences.currencySymbol}
                />

                {/* Stats */}
                <MeterStats
                    distanceMiles={state.distanceMiles}
                    movingTimeSeconds={state.movingTimeSeconds}
                    waitingTimeSeconds={state.waitingTimeSeconds}
                    distanceUnit={preferences.distanceUnit}
                />

                {/* Spacer */}
                <View style={styles.spacer} />

                {/* Controls */}
                <RideControls
                    meterStatus={state.status}
                    profiles={profiles}
                    selectedProfile={state.fareProfile}
                    onStart={startRide}
                    onStop={handleStop}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
        padding: spacing.lg,
        paddingTop: spacing['3xl'],
    },
    spacer: {
        flex: 1,
    },
});
