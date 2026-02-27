import AsyncStorage from '@react-native-async-storage/async-storage';
import { RideRecord } from '../types';

const STORAGE_KEY = 'ride_history';

export async function getAllRides(): Promise<RideRecord[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    return JSON.parse(json) as RideRecord[];
}

export async function getRideById(id: string): Promise<RideRecord | null> {
    const rides = await getAllRides();
    return rides.find((r) => r.id === id) ?? null;
}

export async function saveRide(ride: RideRecord): Promise<void> {
    const rides = await getAllRides();
    rides.unshift(ride); // newest first
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
}

export async function removeRide(id: string): Promise<boolean> {
    const rides = await getAllRides();
    const filtered = rides.filter((r) => r.id !== id);
    if (filtered.length === rides.length) return false;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

// ── Earnings helpers ─────────────────────────────────────────

export async function getTodayEarnings(): Promise<number> {
    const rides = await getAllRides();
    const today = new Date().toDateString();
    return rides
        .filter((r) => new Date(r.endTime).toDateString() === today)
        .reduce((sum, r) => sum + r.totalFare, 0);
}

export async function getWeekEarnings(): Promise<number> {
    const rides = await getAllRides();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return rides
        .filter((r) => new Date(r.endTime) >= weekAgo)
        .reduce((sum, r) => sum + r.totalFare, 0);
}
