import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

interface LocationState {
    latitude: number;
    longitude: number;
    speed: number; // m/s
    timestamp: number;
    hasPermission: boolean;
    error: string | null;
}

const initialState: LocationState = {
    latitude: 0,
    longitude: 0,
    speed: 0,
    timestamp: 0,
    hasPermission: false,
    error: null,
};

/**
 * Hook for GPS location tracking.
 *
 * - Requests foreground permission on mount.
 * - When `tracking` is true, watches position every ~3s.
 * - Returns current location, speed, permission status.
 */
export function useLocation(tracking: boolean) {
    const [location, setLocation] = useState<LocationState>(initialState);
    const watchRef = useRef<Location.LocationSubscription | null>(null);

    // Request permission on mount
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation((prev) => ({
                    ...prev,
                    hasPermission: false,
                    error: 'Location permission denied',
                }));
                return;
            }
            setLocation((prev) => ({ ...prev, hasPermission: true, error: null }));
        })();
    }, []);

    // Watch position when tracking
    useEffect(() => {
        if (!tracking || !location.hasPermission) return;

        let mounted = true;

        (async () => {
            watchRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10, // minimum 10m between updates
                    timeInterval: 3000,   // update every ~3s
                },
                (loc) => {
                    if (!mounted) return;
                    setLocation((prev) => ({
                        ...prev,
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        speed: loc.coords.speed ?? 0,
                        timestamp: loc.timestamp,
                    }));
                }
            );
        })();

        return () => {
            mounted = false;
            watchRef.current?.remove();
            watchRef.current = null;
        };
    }, [tracking, location.hasPermission]);

    return location;
}
