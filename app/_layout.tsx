import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='main'
        options={{
          title: 'Demo',
          headerShown: false,
        }}
      />
      <Stack
        screenOptions={{
          title: 'The Mobile First Company',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
