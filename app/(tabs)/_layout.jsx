import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Home03Icon,
  Analytics01Icon,
  UserIcon,
  Settings01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";

const _layout = () => {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: "#237BDA",
        tabBarLabelStyle: {fontSize: 8},
    }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={Home03Icon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Usagesummary"
        options={{
          title: "Usage",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={Analytics01Icon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={UserIcon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={Notification01Icon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={Settings01Icon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
