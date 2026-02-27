import React, {
    createContext,
    useContext,
    useReducer,
    useRef,
    useEffect,
    useCallback,
    useState,
} from 'react';
import { MeterState, FareProfile, RoutePoint, RideRecord, Preferences } from '../types';
import {
    meterReducer,
    initialMeterState,
    MeterAction,
} from '../engine/meterEngine';
import { useLocation } from '../hooks/useLocation';
import * as rideHistoryStorage from '../storage/rideHistory';
import * as preferencesStorage from '../storage/preferences';
import * as fareProfileStorage from '../storage/fareProfiles';

// ── Context shape ────────────────────────────────────────────

interface MeterContextValue {
    state: MeterState;
    preferences: Preferences;
    profiles: FareProfile[];
    startRide: (profile: FareProfile) => void;
    stopRide: () => RideRecord;
    resetMeter: () => void;
    reloadData: () => Promise<void>;
}

const MeterContext = createContext<MeterContextValue | null>(null);

export function useMeter(): MeterContextValue {
    const ctx = useContext(MeterContext);
    if (!ctx) throw new Error('useMeter must be used within MeterProvider');
    return ctx;
}

// ── Provider ─────────────────────────────────────────────────

export function MeterProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(meterReducer, initialMeterState);
    const [preferences, setPreferences] = useState<Preferences>(
        preferencesStorage.DEFAULT_PREFERENCES
    );
    const [profiles, setProfiles] = useState<FareProfile[]>([]);
    const location = useLocation(state.status === 'running');
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load profiles & preferences
    const reloadData = useCallback(async () => {
        const [prefs, profs] = await Promise.all([
            preferencesStorage.getPreferences(),
            fareProfileStorage.getAllProfiles(),
        ]);
        setPreferences(prefs);
        setProfiles(profs);
    }, []);

    useEffect(() => {
        reloadData();
    }, [reloadData]);

    // Feed GPS updates into the meter
    useEffect(() => {
        if (state.status !== 'running' || !location.latitude) return;

        const point: RoutePoint = {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp,
            speed: location.speed,
        };

        dispatch({
            type: 'LOCATION_UPDATE',
            point,
            speedThresholdMph: preferences.speedThresholdMph,
        });
    }, [location.latitude, location.longitude, location.timestamp]);

    // 1-second tick for time tracking
    useEffect(() => {
        if (state.status === 'running') {
            tickRef.current = setInterval(() => {
                dispatch({
                    type: 'TICK',
                    speedThresholdMph: preferences.speedThresholdMph,
                });
            }, 1000);
        } else {
            if (tickRef.current) {
                clearInterval(tickRef.current);
                tickRef.current = null;
            }
        }

        return () => {
            if (tickRef.current) {
                clearInterval(tickRef.current);
                tickRef.current = null;
            }
        };
    }, [state.status, preferences.speedThresholdMph]);

    const startRide = useCallback(
        (profile: FareProfile) => {
            dispatch({ type: 'START_RIDE', fareProfile: profile });
        },
        []
    );

    const stopRide = useCallback((): RideRecord => {
        dispatch({ type: 'STOP_RIDE' });

        const endTime = new Date().toISOString();
        const fp = state.fareProfile!;

        const distanceCharge = state.distanceMiles * fp.perMileRate;
        const waitingCharge =
            (state.waitingTimeSeconds / 60) * fp.waitingRatePerMinute;

        const ride: RideRecord = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            startTime: state.startTime!,
            endTime,
            distanceMiles: state.distanceMiles,
            movingTimeSeconds: state.movingTimeSeconds,
            waitingTimeSeconds: state.waitingTimeSeconds,
            fareProfileUsed: {
                name: fp.name,
                baseFare: fp.baseFare,
                perMileRate: fp.perMileRate,
                waitingRatePerMinute: fp.waitingRatePerMinute,
            },
            totalFare: state.currentFare,
            fareBreakdown: {
                baseFare: fp.baseFare,
                distanceCharge,
                waitingCharge,
            },
            routePoints: state.routePoints,
        };

        // Save to history (fire-and-forget)
        rideHistoryStorage.saveRide(ride);

        return ride;
    }, [state]);

    const resetMeter = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    return (
        <MeterContext.Provider
            value={{
                state,
                preferences,
                profiles,
                startRide,
                stopRide,
                resetMeter,
                reloadData,
            }}
        >
            {children}
        </MeterContext.Provider>
    );
}
