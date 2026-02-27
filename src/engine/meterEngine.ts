import { MeterState, FareProfile, RoutePoint } from '../types';
import { haversineDistance, msToMph, JITTER_THRESHOLD_MILES } from './geoUtils';

// ── Actions ──────────────────────────────────────────────────

export type MeterAction =
    | { type: 'START_RIDE'; fareProfile: FareProfile }
    | { type: 'LOCATION_UPDATE'; point: RoutePoint; speedThresholdMph: number }
    | { type: 'TICK'; speedThresholdMph: number }
    | { type: 'STOP_RIDE' }
    | { type: 'RESET' };

// ── Initial state ────────────────────────────────────────────

export const initialMeterState: MeterState = {
    status: 'idle',
    movementStatus: 'moving',
    distanceMiles: 0,
    movingTimeSeconds: 0,
    waitingTimeSeconds: 0,
    currentFare: 0,
    fareProfile: null,
    routePoints: [],
    startTime: null,
    lastLocation: null,
};

// ── Fare calculation ─────────────────────────────────────────

function calculateFare(state: MeterState): number {
    if (!state.fareProfile) return 0;
    const { baseFare, perMileRate, waitingRatePerMinute } = state.fareProfile;
    const distanceCharge = state.distanceMiles * perMileRate;
    const waitingCharge = (state.waitingTimeSeconds / 60) * waitingRatePerMinute;
    return baseFare + distanceCharge + waitingCharge;
}

// ── Reducer ──────────────────────────────────────────────────

export function meterReducer(state: MeterState, action: MeterAction): MeterState {
    switch (action.type) {
        case 'START_RIDE': {
            return {
                ...initialMeterState,
                status: 'running',
                fareProfile: action.fareProfile,
                startTime: new Date().toISOString(),
                currentFare: action.fareProfile.baseFare,
            };
        }

        case 'LOCATION_UPDATE': {
            if (state.status !== 'running') return state;

            const { point, speedThresholdMph } = action;
            const speedMph = msToMph(Math.max(0, point.speed ?? 0));
            const isMoving = speedMph >= speedThresholdMph;

            let newDistance = state.distanceMiles;

            // Calculate distance from last known point (filter jitter)
            if (state.lastLocation) {
                const dist = haversineDistance(
                    state.lastLocation.latitude,
                    state.lastLocation.longitude,
                    point.latitude,
                    point.longitude
                );
                if (dist >= JITTER_THRESHOLD_MILES && isMoving) {
                    newDistance += dist;
                }
            }

            const newState: MeterState = {
                ...state,
                distanceMiles: newDistance,
                movementStatus: isMoving ? 'moving' : 'waiting',
                routePoints: [...state.routePoints, point],
                lastLocation: point,
            };

            newState.currentFare = calculateFare(newState);
            return newState;
        }

        case 'TICK': {
            if (state.status !== 'running') return state;

            const speedMph = state.lastLocation
                ? msToMph(Math.max(0, state.lastLocation.speed ?? 0))
                : 0;
            const isMoving = speedMph >= action.speedThresholdMph;

            const newState: MeterState = {
                ...state,
                movingTimeSeconds: state.movingTimeSeconds + (isMoving ? 1 : 0),
                waitingTimeSeconds: state.waitingTimeSeconds + (isMoving ? 0 : 1),
                movementStatus: isMoving ? 'moving' : 'waiting',
            };

            newState.currentFare = calculateFare(newState);
            return newState;
        }

        case 'STOP_RIDE': {
            return {
                ...state,
                status: 'stopped',
                currentFare: calculateFare(state),
            };
        }

        case 'RESET': {
            return initialMeterState;
        }

        default:
            return state;
    }
}
