import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateGroupScreen" />
      <Stack.Screen name="ManageGroup/[id]" />
      <Stack.Screen name="WifiConfig/[id]" />
      <Stack.Screen name="Groups/[id]" />
    </Stack>
  );
}