import { Stack } from "expo-router";
import "./global.css";
import { UserProvider } from "../context/UserContext";
import { UserSignupDataProvider } from "../context/UserSignupDataContext";
import React from "react";

export default function RootLayout() {
  return (
      <UserProvider>
        <UserSignupDataProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="screens" />
          </Stack>
        </UserSignupDataProvider>
      </UserProvider>
  );
}
