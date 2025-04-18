import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const Authlayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false
        }}
      />
       <Stack.Screen
        name="success"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="unsuccess"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="admincheck"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
};

export default Authlayout;

const styles = StyleSheet.create({});
