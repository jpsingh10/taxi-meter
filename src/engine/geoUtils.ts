/**
 * Geographic utility functions for distance and speed calculations.
 */

const EARTH_RADIUS_MILES = 3958.8;
const METERS_PER_MILE = 1609.344;

/** Convert degrees to radians. */
function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Calculate the great-circle distance between two points using the
 * Haversine formula. Returns distance in miles.
 */
export function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_MILES * c;
}

/** Convert meters/second (GPS speed) to miles/hour. */
export function msToMph(ms: number): number {
    return ms * 2.23694;
}

/** Convert miles to kilometers. */
export function milesToKm(miles: number): number {
    return miles * 1.60934;
}

/**
 * Minimum movement threshold in miles (~3 meters).
 * GPS readings below this distance from the last point are treated as jitter.
 */
export const JITTER_THRESHOLD_MILES = 3 / METERS_PER_MILE;
