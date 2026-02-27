// ── Fare Profile ──────────────────────────────────────────────
export interface FareProfile {
    id: string;
    name: string;
    baseFare: number;
    perMileRate: number;
    waitingRatePerMinute: number;
    isDefault: boolean;
}

// ── Route Point ──────────────────────────────────────────────
export interface RoutePoint {
    latitude: number;
    longitude: number;
    timestamp: number;
    speed: number; // m/s from GPS
}

// ── Fare Breakdown ───────────────────────────────────────────
export interface FareBreakdown {
    baseFare: number;
    distanceCharge: number;
    waitingCharge: number;
}

// ── Ride Record ──────────────────────────────────────────────
export interface RideRecord {
    id: string;
    startTime: string; // ISO 8601
    endTime: string;   // ISO 8601
    distanceMiles: number;
    movingTimeSeconds: number;
    waitingTimeSeconds: number;
    fareProfileUsed: Omit<FareProfile, 'id' | 'isDefault'>;
    totalFare: number;
    fareBreakdown: FareBreakdown;
    routePoints: RoutePoint[];
}

// ── User Preferences ─────────────────────────────────────────
export type DistanceUnit = 'miles' | 'km';

export interface Preferences {
    distanceUnit: DistanceUnit;
    currencySymbol: string;
    speedThresholdMph: number;
    driverName: string;
}

// ── Meter State ──────────────────────────────────────────────
export type MeterStatus = 'idle' | 'running' | 'stopped';
export type MovementStatus = 'moving' | 'waiting';

export interface MeterState {
    status: MeterStatus;
    movementStatus: MovementStatus;
    distanceMiles: number;
    movingTimeSeconds: number;
    waitingTimeSeconds: number;
    currentFare: number;
    fareProfile: FareProfile | null;
    routePoints: RoutePoint[];
    startTime: string | null;
    lastLocation: RoutePoint | null;
}
