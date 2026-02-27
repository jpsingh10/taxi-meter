# Taxi Meter App — Design Document

A personal taxi meter app for individual drivers built with React Native + Expo. Tracks distance via GPS, charges per mile and per minute of waiting time, supports multiple fare profiles, and generates shareable receipts.

## Architecture

### Navigation (Tab-based)

Three bottom tabs:

| Tab | Purpose |
|-----|---------|
| **Meter** | The main ride screen — start/stop rides, view live fare |
| **History** | Browse past rides, view details, share receipts |
| **Settings** | Manage fare profiles, app preferences |

### Core Screens

**Meter Screen**
- Large, glanceable fare display (primary focus)
- Status indicator: **Idle** → **Running (Moving)** → **Running (Waiting)** → **Stopped**
- Live stats: distance traveled, elapsed time, waiting time
- Toggle button to switch between dashboard view and live map view
- Big start/stop button — easy to tap without looking

**Ride Summary Screen** (shown when ride ends)
- Full fare breakdown: base fare, distance charge, waiting charge, total
- Route summary (start/end points, distance, duration)
- "Share Receipt" button (generates PDF or shareable text)
- "Save & Close" returns to idle meter

**History Screen**
- Scrollable list of past rides sorted by date
- Each entry shows: date, distance, duration, total fare
- Tap to view full ride details + receipt
- Summary stats at top (today's earnings, weekly earnings)

**Settings Screen**
- Fare Profiles section:
  - List of saved profiles (e.g., "Daytime", "Night/Weekend", "Airport")
  - Create/edit/delete profiles
  - Each profile has: name, base fare ($), per-mile rate ($), waiting rate ($/min)
  - Set a default profile
- Preferences:
  - Distance unit (miles/km)
  - Currency symbol
  - Speed threshold for detecting "waiting" (default: 5 mph)

## GPS & Metering Logic

### Distance Tracking
- Use `expo-location` with foreground location tracking
- Request `ACCESS_FINE_LOCATION` permission
- Track location updates every ~3 seconds while ride is active
- Calculate distance using the Haversine formula between consecutive GPS points
- Filter out GPS jitter (ignore movements < 3 meters between readings)

### Waiting Detection
- When speed drops below configurable threshold (default: 5 mph / 8 km/h) for more than 10 seconds, switch to "waiting" mode
- Waiting mode charges the per-minute waiting rate instead of per-mile
- When speed exceeds threshold, switch back to "moving" mode
- Visual indicator on the meter changes color (green = moving, amber = waiting)

### Fare Calculation
```
Total Fare = Base Fare + (Distance × Per-Mile Rate) + (Waiting Time × Per-Minute Rate)
```

## Data Model

### Fare Profile
```
{
  id: string,
  name: string,
  baseFare: number,
  perMileRate: number,
  waitingRatePerMinute: number,
  isDefault: boolean
}
```

### Ride Record
```
{
  id: string,
  startTime: ISO timestamp,
  endTime: ISO timestamp,
  distanceMiles: number,
  movingTimeSeconds: number,
  waitingTimeSeconds: number,
  fareProfileUsed: { name, baseFare, perMileRate, waitingRatePerMinute },
  totalFare: number,
  fareBreakdown: { baseFare, distanceCharge, waitingCharge },
  routePoints: [{ lat, lng, timestamp, speed }]  // for map replay
}
```

### Storage
- **AsyncStorage** (via `@react-native-async-storage/async-storage`) for fare profiles and preferences
- **AsyncStorage** for ride history (JSON-serialized array)
- No backend, no accounts — all data is device-local

## Receipt Generation

- Generate a formatted receipt with:
  - Date/time, pickup/dropoff locations (reverse geocoded)
  - Distance, duration, fare breakdown, total
  - Driver's custom name/label (optional, set in settings)
- Share via the native share sheet (`expo-sharing`) as:
  - Plain text summary
  - Or PDF (using `expo-print` to generate from HTML template)

## Map Integration

- Use `react-native-maps` (included with Expo)
- Dashboard view is the default (no map, just numbers)
- Toggle button reveals a map showing:
  - Current position marker
  - Route polyline being drawn in real-time
  - Color-coded segments (green = moving, amber = waiting)
- After ride ends, the ride summary shows the completed route

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (managed workflow) |
| Navigation | `expo-router` (file-based routing with tabs) |
| GPS | `expo-location` |
| Maps | `react-native-maps` |
| Storage | `@react-native-async-storage/async-storage` |
| Receipts | `expo-print` + `expo-sharing` |
| State | React Context + `useReducer` for meter state |
| Styling | `StyleSheet` with a consistent design system |

## UX Principles

- **Glanceability**: The fare and status must be readable in under 1 second
- **Large touch targets**: Buttons are 60px+ tall, easy to tap while driving
- **High contrast**: Dark theme with bright accent colors for visibility
- **Minimal interaction**: Start ride = 1 tap. End ride = 1 tap. Everything else is optional.
- **Background tracking**: The meter keeps running even if the driver switches apps (foreground service notification)
