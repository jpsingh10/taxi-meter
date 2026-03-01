import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMeter } from '../../src/context/MeterContext';
import { StatusIndicator } from '../../src/components/StatusIndicator';
import { FareDisplay } from '../../src/components/FareDisplay';
import { MeterStats } from '../../src/components/MeterStats';
import { RideControls } from '../../src/components/RideControls';
import { RideMap } from '../../src/components/RideMap';
import { useThemeColors, spacing, borderRadius } from '../../src/theme';

export default function MeterScreen() {
    const { state, preferences, profiles, startRide, stopRide, resetMeter } =
        useMeter();
    const router = useRouter();
    const [showMap, setShowMap] = useState(false);
    const colors = useThemeColors();
    const styles = createStyles(colors);

    const handleStop = async () => {
        const ride = await stopRide();
        router.push({
            pathname: '/ride-summary',
            params: { rideId: ride.id },
        });
    };

    const isRunning = state.status === 'running';

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Map toggle (only during ride) */}
                {isRunning && (
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={styles.toggleBtn}
                            onPress={() => setShowMap(!showMap)}
                        >
                            <Ionicons
                                name={showMap ? 'speedometer' : 'map'}
                                size={20}
                                color={colors.primary.default}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Status */}
                <StatusIndicator
                    meterStatus={state.status}
                    movementStatus={state.movementStatus}
                />

                {/* Map view or Dashboard view */}
                {showMap && isRunning ? (
                    <>
                        <View style={styles.mapContainer}>
                            <RideMap
                                routePoints={state.routePoints}
                                currentLocation={state.lastLocation}
                                movementStatus={state.movementStatus}
                                isLive={true}
                            />
                        </View>
                        {/* Compact fare overlay on map */}
                        <View style={styles.fareOverlay}>
                            <FareDisplay
                                fare={state.currentFare}
                                currencySymbol={preferences.currencySymbol}
                            />
                        </View>
                    </>
                ) : (
                    <>
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
                    </>
                )}

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

const createStyles = (colors: any) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
        padding: spacing.lg,
        paddingTop: spacing.lg,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    toggleBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary.muted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        flex: 1,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginTop: spacing.sm,
    },
    fareOverlay: {
        marginTop: -spacing['4xl'],
        alignSelf: 'center',
        backgroundColor: 'rgba(10, 10, 15, 0.85)',
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.sm,
    },
    spacer: {
        flex: 1,
    },
});
