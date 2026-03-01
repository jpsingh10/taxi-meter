import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { RideRecord } from '../src/types';
import { useThemeColors, spacing, borderRadius, typography } from '../src/theme';
import { FareBreakdown } from '../src/components/FareBreakdown';
import { useMeter } from '../src/context/MeterContext';
import { generateReceiptHTML } from '../src/utils/receiptGenerator';
import * as rideHistoryStorage from '../src/storage/rideHistory';
import { RideMap } from '../src/components/RideMap';

export default function RideDetailScreen() {
    const router = useRouter();
    const { rideId } = useLocalSearchParams<{ rideId: string }>();
    const { preferences } = useMeter();
    const [ride, setRide] = useState<RideRecord | null>(null);
    const colors = useThemeColors();
    const styles = createStyles(colors);
    const detailStyles = createDetailStyles(colors);

    useEffect(() => {
        if (rideId) {
            rideHistoryStorage.getRideById(rideId).then(setRide);
        }
    }, [rideId]);

    const handleShare = async () => {
        if (!ride) return;
        try {
            const html = generateReceiptHTML(
                ride,
                preferences.currencySymbol,
                preferences.driverName
            );
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Share Ride Receipt',
            });
        } catch {
            Alert.alert('Error', 'Could not generate receipt');
        }
    };

    const handleDelete = () => {
        if (!ride) return;
        Alert.alert('Delete Ride', 'Are you sure you want to delete this ride?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await rideHistoryStorage.removeRide(ride.id);
                    router.back();
                },
            },
        ]);
    };

    if (!ride) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const startDate = new Date(ride.startTime);
    const endDate = new Date(ride.endTime);
    const durationMin = Math.ceil(
        (ride.movingTimeSeconds + ride.waitingTimeSeconds) / 60
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header bar */}
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ride Details</Text>
                <View style={styles.backBtn} />
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Total */}
                <View style={styles.totalHeader}>
                    <Text style={styles.totalFare}>
                        {preferences.currencySymbol}{ride.totalFare.toFixed(2)}
                    </Text>
                    <Text style={styles.totalLabel}>
                        {startDate.toLocaleDateString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Text>
                </View>

                {/* Route Map */}
                <View style={styles.mapContainer}>
                    <RideMap
                        routePoints={ride.routePoints}
                        currentLocation={null}
                        movementStatus="waiting"
                        isLive={false}
                    />
                </View>

                {/* Fare Breakdown */}
                <FareBreakdown
                    breakdown={ride.fareBreakdown}
                    totalFare={ride.totalFare}
                    distanceMiles={ride.distanceMiles}
                    waitingTimeSeconds={ride.waitingTimeSeconds}
                    currencySymbol={preferences.currencySymbol}
                    perMileRate={ride.fareProfileUsed.perMileRate}
                    waitingRatePerMinute={ride.fareProfileUsed.waitingRatePerMinute}
                />

                <View style={styles.detailsCard}>
                    <DetailRow label="Time" value={`${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} colors={colors} />
                    <DetailRow label="Duration" value={`${durationMin} min`} colors={colors} />
                    <DetailRow label="Distance" value={`${ride.distanceMiles.toFixed(2)} mi`} colors={colors} />
                    <DetailRow label="Moving Time" value={`${Math.floor(ride.movingTimeSeconds / 60)} min`} colors={colors} />
                    <DetailRow label="Waiting Time" value={`${Math.floor(ride.waitingTimeSeconds / 60)} min`} colors={colors} />
                    <DetailRow label="Rate Profile" value={ride.fareProfileUsed.name} colors={colors} />
                </View>

                {/* Actions */}
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                    <Ionicons name="share-outline" size={20} color={colors.text.inverse} />
                    <Text style={styles.shareBtnText}>Share Receipt</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                    <Text style={styles.deleteBtnText}>Delete Ride</Text>
                </TouchableOpacity>

                <View style={{ height: spacing['5xl'] }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailRow({ label, value, colors }: { label: string; value: string; colors: any }) {
    const detailStyles = createDetailStyles(colors);
    return (
        <View style={detailStyles.row}>
            <Text style={detailStyles.label}>{label}</Text>
            <Text style={detailStyles.value}>{value}</Text>
        </View>
    );
}

const createDetailStyles = (colors: any) => StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    label: {
        ...typography.body,
        color: colors.text.muted,
    },
    value: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
    },
});

const createStyles = (colors: any) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...typography.h3,
        color: colors.text.primary,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        ...typography.body,
        color: colors.text.muted,
    },
    totalHeader: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    totalFare: {
        ...typography.display,
        color: colors.primary.default,
    },
    totalLabel: {
        ...typography.body,
        color: colors.text.muted,
        marginTop: spacing.xs,
    },
    mapContainer: {
        height: 250,
        marginBottom: spacing['2xl'],
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    detailsCard: {
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
        marginTop: spacing.lg,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primary.default,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        marginTop: spacing['2xl'],
        minHeight: 56,
    },
    shareBtnText: {
        ...typography.button,
        color: colors.text.inverse,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.dangerMuted,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        marginTop: spacing.md,
        minHeight: 56,
    },
    deleteBtnText: {
        ...typography.button,
        color: colors.danger,
    },
});
