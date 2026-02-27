import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { RoutePoint, MovementStatus } from '../types';
import { colors } from '../theme';

interface Props {
    routePoints: RoutePoint[];
    currentLocation: RoutePoint | null;
    movementStatus: MovementStatus;
    isLive: boolean; // true during ride, false for completed route
}

interface Segment {
    coordinates: { latitude: number; longitude: number }[];
    isMoving: boolean;
}

const SPEED_THRESHOLD_MS = 2.235; // ~5 mph in m/s

/**
 * Break route points into segments colored by movement status.
 */
function buildSegments(points: RoutePoint[]): Segment[] {
    if (points.length < 2) return [];

    const segments: Segment[] = [];
    let currentSegment: Segment = {
        coordinates: [{ latitude: points[0].latitude, longitude: points[0].longitude }],
        isMoving: (points[0].speed ?? 0) >= SPEED_THRESHOLD_MS,
    };

    for (let i = 1; i < points.length; i++) {
        const isMoving = (points[i].speed ?? 0) >= SPEED_THRESHOLD_MS;
        const coord = { latitude: points[i].latitude, longitude: points[i].longitude };

        if (isMoving === currentSegment.isMoving) {
            currentSegment.coordinates.push(coord);
        } else {
            // Add the transition point to both segments for continuity
            currentSegment.coordinates.push(coord);
            segments.push(currentSegment);
            currentSegment = {
                coordinates: [coord],
                isMoving,
            };
        }
    }

    if (currentSegment.coordinates.length > 0) {
        segments.push(currentSegment);
    }

    return segments;
}

export function RideMap({
    routePoints,
    currentLocation,
    movementStatus,
    isLive,
}: Props) {
    const mapRef = useRef<MapView>(null);

    // Auto-follow current position during live ride
    useEffect(() => {
        if (isLive && currentLocation && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                },
                500
            );
        }
    }, [currentLocation?.latitude, currentLocation?.longitude, isLive]);

    // Fit all points for completed route
    useEffect(() => {
        if (!isLive && routePoints.length > 1 && mapRef.current) {
            const coords = routePoints.map((p) => ({
                latitude: p.latitude,
                longitude: p.longitude,
            }));
            mapRef.current.fitToCoordinates(coords, {
                edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                animated: true,
            });
        }
    }, [isLive, routePoints.length]);

    const segments = buildSegments(routePoints);

    const initialRegion = currentLocation
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        : {
            latitude: 37.78,
            longitude: -122.43,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={initialRegion}
                showsUserLocation={isLive}
                showsMyLocationButton={false}
                userInterfaceStyle="dark"
            >
                {/* Route segments */}
                {segments.map((segment, index) => (
                    <Polyline
                        key={index}
                        coordinates={segment.coordinates}
                        strokeColor={
                            segment.isMoving ? colors.status.moving : colors.status.waiting
                        }
                        strokeWidth={4}
                    />
                ))}

                {/* Current position marker during live ride */}
                {isLive && currentLocation && (
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                    >
                        <View
                            style={[
                                styles.marker,
                                {
                                    backgroundColor:
                                        movementStatus === 'moving'
                                            ? colors.status.moving
                                            : colors.status.waiting,
                                },
                            ]}
                        />
                    </Marker>
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    marker: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
});
