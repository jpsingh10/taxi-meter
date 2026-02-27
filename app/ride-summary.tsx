import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { RideRecord } from '../src/types';
import { colors, spacing, borderRadius, typography } from '../src/theme';
import { FareBreakdown } from '../src/components/FareBreakdown';
import { useMeter } from '../src/context/MeterContext';
import {
    generateReceiptHTML,
    generateReceiptText,
} from '../src/utils/receiptGenerator';
import * as rideHistoryStorage from '../src/storage/rideHistory';

export default function RideSummaryScreen() {
    const router = useRouter();
    const { rideId } = useLocalSearchParams<{ rideId: string }>();
    const { preferences, resetMeter } = useMeter();
    const [ride, setRide] = useState<RideRecord | null>(null);

    useEffect(() => {
        if (rideId) {
            rideHistoryStorage.getRideById(rideId).then(setRide);
        }
    }, [rideId]);

    const handleShareReceipt = async () => {
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
        } catch (error) {
            Alert.alert('Error', 'Could not generate receipt');
        }
    };

    const handleClose = () => {
        resetMeter();
        router.replace('/');
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
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={32} color={colors.text.inverse} />
                    </View>
                    <Text style={styles.title}>Ride Complete</Text>
                    <Text style={styles.totalFare}>
                        {preferences.currencySymbol}{ride.totalFare.toFixed(2)}
                    </Text>
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

                {/* Ride Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.sectionTitle}>Ride Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>
                            {startDate.toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>
                            {startDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}{' '}
                            –{' '}
                            {endDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Duration</Text>
                        <Text style={styles.detailValue}>{durationMin} min</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Distance</Text>
                        <Text style={styles.detailValue}>
                            {ride.distanceMiles.toFixed(2)} mi
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rate Profile</Text>
                        <Text style={styles.detailValue}>{ride.fareProfileUsed.name}</Text>
                    </View>
                </View>

                {/* Actions */}
                <TouchableOpacity style={styles.shareBtn} onPress={handleShareReceipt}>
                    <Ionicons name="share-outline" size={20} color={colors.text.inverse} />
                    <Text style={styles.shareBtnText}>Share Receipt</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                    <Text style={styles.closeBtnText}>Save & Close</Text>
                </TouchableOpacity>
            </ScrollView>
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
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing['3xl'],
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
    header: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    checkCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary.default,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    totalFare: {
        ...typography.display,
        color: colors.primary.default,
    },
    detailsCard: {
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    detailLabel: {
        ...typography.body,
        color: colors.text.muted,
    },
    detailValue: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
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
    closeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        marginTop: spacing.md,
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.border.default,
        minHeight: 56,
    },
    closeBtnText: {
        ...typography.button,
        color: colors.text.secondary,
    },
});
