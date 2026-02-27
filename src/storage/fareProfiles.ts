import AsyncStorage from '@react-native-async-storage/async-storage';
import { FareProfile } from '../types';

const STORAGE_KEY = 'fare_profiles';

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const DEFAULT_PROFILE: FareProfile = {
    id: 'default',
    name: 'Standard',
    baseFare: 3.0,
    perMileRate: 2.0,
    waitingRatePerMinute: 0.5,
    isDefault: true,
};

export async function getAllProfiles(): Promise<FareProfile[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) {
        // First launch — seed with default profile
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_PROFILE]));
        return [DEFAULT_PROFILE];
    }
    return JSON.parse(json) as FareProfile[];
}

export async function getProfileById(id: string): Promise<FareProfile | null> {
    const profiles = await getAllProfiles();
    return profiles.find((p) => p.id === id) ?? null;
}

export async function getDefaultProfile(): Promise<FareProfile> {
    const profiles = await getAllProfiles();
    return profiles.find((p) => p.isDefault) ?? profiles[0] ?? DEFAULT_PROFILE;
}

export async function saveProfile(
    profile: Omit<FareProfile, 'id'>
): Promise<FareProfile> {
    const profiles = await getAllProfiles();
    const newProfile: FareProfile = { ...profile, id: generateId() };

    // If this is set as default, unset others
    if (newProfile.isDefault) {
        profiles.forEach((p) => (p.isDefault = false));
    }

    profiles.push(newProfile);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return newProfile;
}

export async function updateProfile(
    id: string,
    updates: Partial<Omit<FareProfile, 'id'>>
): Promise<FareProfile | null> {
    const profiles = await getAllProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) return null;

    // If setting as default, unset others
    if (updates.isDefault) {
        profiles.forEach((p) => (p.isDefault = false));
    }

    profiles[index] = { ...profiles[index], ...updates };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return profiles[index];
}

export async function removeProfile(id: string): Promise<boolean> {
    const profiles = await getAllProfiles();
    const filtered = profiles.filter((p) => p.id !== id);

    if (filtered.length === profiles.length) return false;

    // If we removed the default, make the first one default
    if (!filtered.some((p) => p.isDefault) && filtered.length > 0) {
        filtered[0].isDefault = true;
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}
