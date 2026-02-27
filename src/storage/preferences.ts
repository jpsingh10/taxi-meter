import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preferences } from '../types';

const STORAGE_KEY = 'preferences';

export const DEFAULT_PREFERENCES: Preferences = {
    distanceUnit: 'miles',
    currencySymbol: '$',
    speedThresholdMph: 5,
    driverName: '',
};

export async function getPreferences(): Promise<Preferences> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(json) };
}

export async function updatePreferences(
    updates: Partial<Preferences>
): Promise<Preferences> {
    const current = await getPreferences();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}
