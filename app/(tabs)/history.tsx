import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RideRecord } from '../../src/types';
import { useThemeColors, spacing, typography } from '../../src/theme';
import { EarningsSummary } from '../../src/components/EarningsSummary';
import { RideHistoryCard } from '../../src/components/RideHistoryCard';
import { useMeter } from '../../src/context/MeterContext';
import * as rideHistoryStorage from '../../src/storage/rideHistory';

export default function HistoryScreen() {
    const router = useRouter();
    const { preferences } = useMeter();
    const [rides, setRides] = useState<RideRecord[]>([]);
    const [todayEarnings, setTodayEarnings] = useState(0);
    const [weekEarnings, setWeekEarnings] = useState(0);
    const colors = useThemeColors();
    const styles = createStyles(colors);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const [allRides, today, week] = await Promise.all([
                    rideHistoryStorage.getAllRides(),
                    rideHistoryStorage.getTodayEarnings(),
                    rideHistoryStorage.getWeekEarnings(),
                ]);
                setRides(allRides);
                setTodayEarnings(today);
                setWeekEarnings(week);
            })();
        }, [])
    );

    const handleRidePress = (ride: RideRecord) => {
        router.push({
            pathname: '/ride-detail',
            params: { rideId: ride.id },
        });
    };

    const renderEmpty = () => (
        <View style={styles.empty}>
            <Ionicons name="car-outline" size={64} color={colors.text.muted} />
            <Text style={styles.emptyTitle}>No Rides Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start your first ride from the Meter tab
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.screenTitle}>Ride History</Text>

                <EarningsSummary
                    todayEarnings={todayEarnings}
                    weekEarnings={weekEarnings}
                    totalRides={rides.length}
                    currencySymbol={preferences.currencySymbol}
                />

                <FlatList
                    data={rides}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RideHistoryCard
                            ride={item}
                            currencySymbol={preferences.currencySymbol}
                            onPress={handleRidePress}
                        />
                    )}
                    ListEmptyComponent={renderEmpty}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={rides.length === 0 ? styles.emptyContainer : undefined}
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
    screenTitle: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing['2xl'],
        marginTop: spacing.lg,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing['6xl'],
        gap: spacing.md,
    },
    emptyContainer: {
        flex: 1,
    },
    emptyTitle: {
        ...typography.h2,
        color: colors.text.secondary,
    },
    emptySubtitle: {
        ...typography.body,
        color: colors.text.muted,
        textAlign: 'center',
    },
});
