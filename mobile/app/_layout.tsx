import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // We will use custom headers or simple safe area views
                contentStyle: { backgroundColor: '#0f172a' }, // Dark background default
            }}
        />
    );
}
