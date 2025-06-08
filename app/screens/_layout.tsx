import { Stack } from 'expo-router';
import React from 'react';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateGroupScreen" />
      <Stack.Screen name="WifiConfig/[id]" />
      <Stack.Screen name="BillingSummary/[id]" />
      <Stack.Screen name="Groups/[id]" />
      <Stack.Screen name="MyQuota/[id]" />
      <Stack.Screen name="BillingHistory" />
    </Stack>
  );
}