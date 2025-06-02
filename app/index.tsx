import { useRouter } from "expo-router";
import { SafeAreaView, StatusBar, Text, View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import ImagePath from "../constants/ImagePath";
import Btn from "../components/Btn";
import { useUser } from "../context/UserContext";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const spinValue = useRef(new Animated.Value(0)).current;
  const { user } = useUser();
 
  useEffect(() => {

    if(user){
      console.log("User already exists, navigating to Home from index.tsx");
      router.replace('/(tabs)/Home');
      return;
    }

    const checkUser = async () => {
      console.log("Checking user data in AsyncStorage...from index.tsx");
      const token = await AsyncStorage.getItem("access_token");
      const loggedUserData = await AsyncStorage.getItem("user_data");
      if (token && loggedUserData) {
          console.log("User data found, navigating to Home...");
          router.replace('/(tabs)/Home');
      }
    };
    checkUser();
  }, []);

  
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mb-2">
          <View className="mb-2">
            <Animated.Image
              source={ImagePath.Logo}
              style={{ 
                width: 240, 
                height: 240, 
                transform: [{ rotateY: spin }] 
              }}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text className="text-xl text-blue-500 mb-6 text-center font-semibold">
          Fair and smart Wi-Fi usage tracking and billing for shared networks
        </Text>
        <View className="w-full mt-6">
          <Btn
            width="100%"
            text="Get Started"
            onPress={() => router.navigate("/(auth)/login")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}


