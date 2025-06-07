import React, { useContext } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Btn from "../../components/Btn";

const success = () => {
  const router = useRouter();
  
  const handleContinue = () => {
      router.replace("/(auth)/login");
   
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 items-center justify-center px-5">
        <View className="mb-5">
          <View className="w-24 h-24 rounded-full border-2 border-green-500 items-center justify-center">
            <Ionicons name="checkmark" size={60} color="#3bb912" />
          </View>
        </View>
        <Text className="text-2xl font-bold text-[#3bb912] mb-3">Success!</Text>
        <Text className="text-base text-gray-600 text-center mb-8 max-w-xs">
          Your mobile number has been successfully verified, and your
          registration is complete.
        </Text>
        <View className="w-full rounded-lg p-6">
          <Btn width="100%" text="Continue" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default success;