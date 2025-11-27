import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        title: 'The Mobile First Company',
        headerShown: false,
      }}
    />
  );
}
