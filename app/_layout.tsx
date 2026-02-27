import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0A0A0F' },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="ride-summary"
                    options={{
                        headerShown: false,
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="ride-detail"
                    options={{
                        headerShown: false,
                        presentation: 'card',
                    }}
                />
            </Stack>
        </>
    );
}
