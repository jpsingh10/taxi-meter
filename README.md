# 🚕 TaxiMeter

A complete, feature-rich personal taxi meter application built with **React Native** and **Expo**. Designed for drivers to accurately track rides, calculate fares based on dynamic profiles, and generate printable receipts for passengers.

## Features

- ✅ **GPS Distance Tracking**: High-accuracy distance calculation using the Haversine formula with jitter filtering and smoothing.
- ✅ **Dynamic Fare Calculation**: Set your own rates! Charging by the mile/km + per-minute waiting charges when stuck in traffic.
- ✅ **Automatic Movement Detection**: Intelligently switches between "Moving" and "Waiting" statuses based on speed thresholds (e.g., stops charging distance and starts charging wait time at red lights).
- ✅ **Custom Fare Profiles**: Create, edit, and save multiple fare profiles (e.g., standard, night rate, airport flat rate).
- ✅ **Live Dashboard & Map**: View real-time fare, distance, and time. Toggle between a digital dashboard and a live interactive map during the ride.
- ✅ **Color-Coded Route Tracking**: The live map traces your route, color-coded based on your status (🟢 Green = Moving, 🟡 Amber = Waiting).
- ✅ **Comprehensive Ride History**: View past rides, daily/weekly earnings summaries, and detailed breakdowns of each trip.
- ✅ **Receipt Generation**: Generate PDF receipts for completed rides with full fare breakdowns and route maps, and share them directly via the native share sheet.
- ✅ **Dynamic Theming**: Fluidly adapts to your device's system styling with a high-contrast Light mode and an in-car-optimized Dark mode.
- ✅ **Flexible Preferences**: Completely configurable distance units (Miles/Km), currency symbols, speed thresholds, and driver names.

## Architecture & Tech Stack

- **Framework**: React Native + Expo (SDK 54)
- **Routing**: `expo-router` (File-based tab routing)
- **Maps**: `react-native-maps`
- **Location Services**: `expo-location` (Foreground GPS tracking)
- **Storage**: `@react-native-async-storage/async-storage` (Local persistence for history, profiles, and preferences)
- **PDF Generation**: `expo-print` & `expo-sharing`
- **UI & Icons**: `@expo/vector-icons` & Custom styling system

## Requirements

- Node.js (v18 or newer recommended)
- React Native / Expo development environment setup
- **Physical Device**: A physical iOS or Android device is *highly recommended* because GPS tracking does not function properly in simulators.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd taxi-meter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

4. **Run on your device:**
   - Download the **Expo Go** app on your iOS or Android device.
   - Scan the QR code presented in your terminal (or browser) to launch the app.

## Project Structure

```
taxi-meter/
├── app/                  # Expo Router pages (Tabs & Stack screens)
│   ├── (tabs)/           # Main navigation tabs (Meter, History, Settings)
│   ├── ride-detail.tsx   # Detailed summary of a past ride
│   └── ride-summary.tsx  # Post-ride summary receipt and map
├── src/                  # Application source code
│   ├── components/       # Reusable UI elements (Map, Controls, Stats, Forms)
│   ├── context/          # React Context (MeterContext manages the core state)
│   ├── engine/           # Core logic (GeoUtils, Haversine, Meter Reducer)
│   ├── hooks/            # Custom React hooks (useLocation, useThemeColors)
│   ├── storage/          # AsyncStorage wrappers for persistence
│   ├── theme/            # Design system (Colors, Typography, Spacing)
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper utilities (PDF Receipt Generator)
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## Building for Production

To create standalone, native applications for iOS (.ipa) and Android (.apk/.aab) without Expo Go, we use EAS (Expo Application Services).

1. Install the EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Build for Android:
   ```bash
   eas build -p android --profile preview
   ```

4. Build for iOS (Requires Apple Developer account):
   ```bash
   eas build -p ios
   ```

## License

This project is open-source and available under the [MIT License](LICENSE).
