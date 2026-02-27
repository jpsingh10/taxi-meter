# Taxi Meter App Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a personal taxi meter app for individual drivers using React Native + Expo with GPS tracking, fare calculation, ride history, and receipt generation.

**Architecture:** Tab-based navigation (Meter | History | Settings) with React Context for global state. GPS tracking via `expo-location`, local storage via `AsyncStorage`, maps via `react-native-maps`.

**Tech Stack:** React Native, Expo (managed workflow), expo-router, expo-location, react-native-maps, AsyncStorage, expo-print, expo-sharing

---

### Task 1: Project Scaffolding

**Files:**
- Create: Expo project via `npx create-expo-app`
- Create: `app/_layout.tsx` (root layout with tab navigation)
- Create: `app/(tabs)/_layout.tsx` (tab bar configuration)
- Create: `app/(tabs)/index.tsx` (meter tab placeholder)
- Create: `app/(tabs)/history.tsx` (history tab placeholder)
- Create: `app/(tabs)/settings.tsx` (settings tab placeholder)

**Step 1: Initialize Expo project**

```bash
npx -y create-expo-app@latest ./ --template blank-typescript
```

**Step 2: Install dependencies**

```bash
npx expo install expo-location react-native-maps @react-native-async-storage/async-storage expo-print expo-sharing @expo/vector-icons
```

**Step 3: Set up tab navigation with expo-router**

```bash
npx expo install expo-router expo-constants expo-linking
```

Configure `app/_layout.tsx` as root layout and `app/(tabs)/_layout.tsx` with three tabs (Meter, History, Settings) using `@expo/vector-icons` for tab icons.

**Step 4: Create placeholder screens**

Each tab gets a simple screen with a title to verify routing works.

**Step 5: Verify the app runs**

```bash
npx expo start
```

Open in Expo Go on a device or simulator. Verify all three tabs render and navigation works.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold Expo project with tab navigation"
```

---

### Task 2: Design System & Theme

**Files:**
- Create: `src/theme/colors.ts`
- Create: `src/theme/spacing.ts`
- Create: `src/theme/typography.ts`
- Create: `src/theme/index.ts`

**Step 1: Create color palette**

Dark theme optimized for in-car visibility:
- Background: deep dark (`#0A0A0F`, `#14141F`)
- Primary accent: bright teal (`#00E5A0`)
- Warning/waiting: amber (`#FFB800`)
- Danger/stop: red (`#FF4757`)
- Text: white and gray variants
- Card surfaces: semi-transparent dark

**Step 2: Create spacing and typography scales**

- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Typography: large display (48px) for fare, medium (24px) for stats, small (14px) for labels
- Font weights: bold for numbers, medium for labels

**Step 3: Export unified theme object**

Single import point from `src/theme/index.ts`.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add design system with dark theme"
```

---

### Task 3: Data Models & Storage Layer

**Files:**
- Create: `src/types/index.ts`
- Create: `src/storage/fareProfiles.ts`
- Create: `src/storage/rideHistory.ts`
- Create: `src/storage/preferences.ts`

**Step 1: Define TypeScript types**

```typescript
// FareProfile
interface FareProfile {
  id: string;
  name: string;
  baseFare: number;
  perMileRate: number;
  waitingRatePerMinute: number;
  isDefault: boolean;
}

// RideRecord
interface RideRecord {
  id: string;
  startTime: string;
  endTime: string;
  distanceMiles: number;
  movingTimeSeconds: number;
  waitingTimeSeconds: number;
  fareProfileUsed: Omit<FareProfile, 'id' | 'isDefault'>;
  totalFare: number;
  fareBreakdown: {
    baseFare: number;
    distanceCharge: number;
    waitingCharge: number;
  };
  routePoints: RoutePoint[];
}

// RoutePoint
interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed: number;
}

// Preferences
interface Preferences {
  distanceUnit: 'miles' | 'km';
  currencySymbol: string;
  speedThresholdMph: number;
  driverName: string;
}
```

**Step 2: Create AsyncStorage CRUD wrappers**

Each storage module exports:
- `getAll()` / `getById(id)`
- `save(item)` / `update(id, partial)`
- `remove(id)`

Include a seed function that creates a default "Standard" fare profile on first launch.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add data models and AsyncStorage layer"
```

---

### Task 4: Fare Profile Management (Settings Screen)

**Files:**
- Modify: `app/(tabs)/settings.tsx`
- Create: `src/components/FareProfileCard.tsx`
- Create: `src/components/FareProfileForm.tsx`
- Create: `src/components/PreferencesForm.tsx`

**Step 1: Build FareProfileCard component**

Displays a single fare profile with name, rates, and edit/delete actions. Shows a "Default" badge on the default profile.

**Step 2: Build FareProfileForm component**

Modal form for creating/editing a fare profile with fields for name, base fare, per-mile rate, and waiting rate. Input validation (no negative numbers, name required).

**Step 3: Build PreferencesForm component**

Form for distance unit toggle, currency symbol input, speed threshold slider, and driver name.

**Step 4: Build Settings screen**

Scrollable screen with:
- "Fare Profiles" section header + "Add Profile" button
- List of FareProfileCard components
- "Preferences" section with PreferencesForm

**Step 5: Verify**

Open app, go to Settings tab. Create, edit, delete fare profiles. Change preferences. Close and reopen app — verify data persists.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add fare profile management and settings screen"
```

---

### Task 5: GPS Tracking & Meter Engine

**Files:**
- Create: `src/hooks/useLocation.ts`
- Create: `src/engine/meterEngine.ts`
- Create: `src/engine/geoUtils.ts`
- Create: `src/context/MeterContext.tsx`

**Step 1: Create geo utility functions**

```typescript
// Haversine distance between two coordinates in miles
function haversineDistance(lat1, lon1, lat2, lon2): number

// Convert m/s to mph
function msToMph(ms: number): number
```

**Step 2: Create useLocation hook**

- Request foreground location permissions via `expo-location`
- Start/stop location watching with `Location.watchPositionAsync`
- Configure: accuracy high, distance interval 10m, time interval 3000ms
- Return current location, speed, and permission status

**Step 3: Create meter engine**

The core fare calculation logic as a reducer:

```typescript
type MeterState = {
  status: 'idle' | 'running' | 'stopped';
  movementStatus: 'moving' | 'waiting';
  distanceMiles: number;
  movingTimeSeconds: number;
  waitingTimeSeconds: number;
  currentFare: number;
  fareProfile: FareProfile;
  routePoints: RoutePoint[];
  startTime: string | null;
}

type MeterAction =
  | { type: 'START_RIDE'; fareProfile: FareProfile }
  | { type: 'LOCATION_UPDATE'; location: RoutePoint }
  | { type: 'TICK'; speedThresholdMph: number }
  | { type: 'STOP_RIDE' }
  | { type: 'RESET' }
```

On each `LOCATION_UPDATE`:
- Calculate distance from last point (Haversine), filter jitter (< 3m ignored)
- Add distance to total
- Determine if moving or waiting based on speed vs threshold
- Recalculate fare: `baseFare + (distance × perMileRate) + (waitingTime × waitingRate/60)`

**Step 4: Create MeterContext**

React Context provider wrapping the meter reducer, exposing state and actions (startRide, stopRide, reset) to all components.

**Step 5: Verify**

Run app on a physical device (GPS required). Start a ride, walk around — verify distance accumulates. Stand still — verify waiting time accumulates. Stop ride — verify totals are correct.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add GPS tracking and meter calculation engine"
```

---

### Task 6: Meter Screen UI

**Files:**
- Modify: `app/(tabs)/index.tsx`
- Create: `src/components/FareDisplay.tsx`
- Create: `src/components/MeterStats.tsx`
- Create: `src/components/RideControls.tsx`
- Create: `src/components/StatusIndicator.tsx`

**Step 1: Build StatusIndicator component**

Colored pill showing current state:
- Gray "IDLE" when no ride
- Green pulsing "MOVING" during ride
- Amber pulsing "WAITING" when stopped at lights

**Step 2: Build FareDisplay component**

Large, centered fare amount in display font (48px+). Currency symbol + fare to 2 decimal places. Animates on value change.

**Step 3: Build MeterStats component**

Three stat cards in a row:
- Distance (mi or km)
- Moving time (MM:SS)
- Waiting time (MM:SS)

**Step 4: Build RideControls component**

- When idle: Large "START RIDE" button (green) + fare profile selector dropdown
- When running: Large "END RIDE" button (red)
- Buttons are 60px+ tall for easy tapping

**Step 5: Assemble Meter screen**

Stack components vertically: StatusIndicator → FareDisplay → MeterStats → RideControls. Add the map/dashboard toggle button in the top-right.

**Step 6: Verify**

Open app on device. Start a ride — see fare updating, status changing. Stop ride — see summary. Verify it's glanceable and touch targets are large.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: build meter screen UI with fare display and controls"
```

---

### Task 7: Ride Summary & Receipt Generation

**Files:**
- Create: `app/ride-summary.tsx`
- Create: `src/utils/receiptGenerator.ts`
- Create: `src/components/FareBreakdown.tsx`

**Step 1: Build FareBreakdown component**

Table showing:
| Item | Amount |
|------|--------|
| Base Fare | $X.XX |
| Distance (X.X mi × $X.XX) | $X.XX |
| Waiting (X min × $X.XX) | $X.XX |
| **Total** | **$X.XX** |

**Step 2: Build receipt generator**

```typescript
function generateReceiptHTML(ride: RideRecord, driverName: string): string
```

Generates an HTML template for a clean receipt with ride details, fare breakdown, and driver info. Used by `expo-print` to create PDF.

**Step 3: Build Ride Summary screen**

Shown after ending a ride:
- Fare breakdown at top
- Ride details (date, time, distance, duration)
- "Share Receipt" button → generates PDF via `expo-print`, shares via `expo-sharing`
- "Save & Close" button → saves ride to history, navigates back to meter

**Step 4: Verify**

End a ride → verify summary screen appears with correct breakdown. Tap "Share Receipt" → verify PDF generates and share sheet opens. Tap "Save & Close" → verify ride appears in history.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add ride summary screen with receipt generation"
```

---

### Task 8: Ride History Screen

**Files:**
- Modify: `app/(tabs)/history.tsx`
- Create: `src/components/RideHistoryCard.tsx`
- Create: `src/components/EarningsSummary.tsx`
- Create: `app/ride-detail.tsx`

**Step 1: Build EarningsSummary component**

Top banner showing:
- Today's earnings (sum of today's rides)
- This week's earnings
- Total rides count

**Step 2: Build RideHistoryCard component**

Card for each past ride showing: date/time, distance, duration, total fare. Tap to navigate to ride detail.

**Step 3: Build Ride Detail screen**

Full details of a past ride:
- All info from the ride summary
- FareBreakdown component
- "Share Receipt" button (re-generates receipt)
- "Delete Ride" button with confirmation

**Step 4: Build History screen**

EarningsSummary at top, then FlatList of RideHistoryCard sorted by date descending. "No rides yet" empty state when history is empty.

**Step 5: Verify**

Complete a few rides. Go to History tab — verify rides appear in order. Tap a ride — verify detail screen shows correct data. Share receipt from a past ride. Delete a ride — verify it's removed.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add ride history screen with earnings summary"
```

---

### Task 9: Map Integration

**Files:**
- Create: `src/components/RideMap.tsx`
- Modify: `app/(tabs)/index.tsx` (add map toggle)
- Modify: `app/ride-summary.tsx` (add route map)

**Step 1: Build RideMap component**

Uses `react-native-maps` MapView:
- Shows current position marker during ride
- Draws polyline of route in real-time
- Color-coded: green segments for moving, amber for waiting
- Auto-follows the driver's position
- After ride: shows the full completed route

**Step 2: Add map toggle to Meter screen**

Toggle button in top corner switches between:
- Dashboard view (default): just the fare/stats/controls
- Map view: shows RideMap with a compact fare overlay at the bottom

**Step 3: Add route map to Ride Summary**

Small map at the bottom of the ride summary showing the completed route.

**Step 4: Verify**

Start a ride, toggle to map view — verify position marker and route polyline appear. Drive/walk around — verify route traces. Switch back to dashboard — verify stats still updating. End ride — verify route appears on summary screen.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add map integration with live route tracking"
```

---

### Task 10: Polish & Final Touches

**Files:**
- Modify: various component files for animations
- Create: `src/components/SplashScreen.tsx` (if needed)
- Modify: `app.json` (app name, permissions, etc.)

**Step 1: Add micro-animations**

- Fare counter: smooth number transition when fare updates
- Status indicator: pulsing glow animation
- Button press: scale feedback
- Screen transitions: slide animations

**Step 2: Configure app.json**

```json
{
  "expo": {
    "name": "TaxiMeter",
    "slug": "taxi-meter",
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "TaxiMeter needs your location to track ride distance and calculate fares.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "TaxiMeter needs background location to keep tracking your ride when the app is in the background."
      }
    },
    "android": {
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION", "ACCESS_BACKGROUND_LOCATION"]
    }
  }
}
```

**Step 3: Add empty states and error handling**

- No location permission: show permission request screen
- GPS unavailable: show warning banner
- No fare profiles: prompt to create one before starting a ride
- Empty ride history: friendly illustration + "Start your first ride" message

**Step 4: Verify full app flow**

1. Fresh install → default fare profile exists
2. Create additional fare profiles
3. Start ride → fare accumulates while moving
4. Stop at a light → waiting time charges kick in
5. End ride → summary with correct breakdown
6. Share receipt → PDF generates
7. Check history → ride is saved
8. View past ride → details correct

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add polish, animations, and error handling"
```

---

## Verification Plan

### Automated Testing

Since this is a GPS-dependent mobile app, automated unit testing is limited to the pure logic:

```bash
# Run the test suite
npx jest
```

Tests to write:
- `src/engine/__tests__/geoUtils.test.ts` — Haversine distance calculation with known coordinates
- `src/engine/__tests__/meterEngine.test.ts` — Fare calculation with mock location updates
- `src/storage/__tests__/fareProfiles.test.ts` — CRUD operations on profiles

### Manual Verification (Physical Device Required)

1. **Install on device**: `npx expo start` → scan QR code with Expo Go
2. **GPS tracking**: Walk outside with the app running, verify distance increments sensibly
3. **Waiting detection**: Stand still for 15+ seconds, verify status changes to "WAITING" and waiting charges apply
4. **Fare accuracy**: Manual calculation — ride 1 mile at $2.00/mile with $5.00 base = $7.00 total
5. **Receipt sharing**: End a ride, tap share, verify PDF opens correctly
6. **Data persistence**: Close app completely, reopen — verify ride history and profiles persist
7. **Map view**: Toggle map during a ride, verify route draws correctly
