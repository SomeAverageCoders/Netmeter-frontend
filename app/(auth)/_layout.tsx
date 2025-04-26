import React from "react";
import { Stack } from "expo-router";

const Authlayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="success" />
      <Stack.Screen name="unsuccess" />
      <Stack.Screen name="admincheck" />
      <Stack.Screen name="phoneVerification" />
    </Stack>
  );
};

export default Authlayout;
