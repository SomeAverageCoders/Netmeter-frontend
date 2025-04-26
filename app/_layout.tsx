import { Stack } from "expo-router";
import "./global.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import { UserSignupDataProvider } from "../context/UserSignupDataContext";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const [user, setUser] = useState(null);
  return (
    <ConvexProvider client={convex}>
      <UserContext.Provider value={{ user, setUser }}>
        <UserSignupDataProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </UserSignupDataProvider>
      </UserContext.Provider>
    </ConvexProvider>
  );
}
