import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Btn from "../../components/Btn";

const Unsuccess = () => {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 items-center justify-center px-5">
        <View className="mb-5">
          <View className="w-24 h-24 rounded-full border-2 border-red-600 items-center justify-center">
            <Ionicons name="close" size={60} color="#ec1515" />
          </View>
        </View>
        <Text className="text-2xl font-bold text-red-600 mb-3">
          Verification Failed!
        </Text>
        <Text className="text-base text-gray-600 text-center mb-6 max-w-xs">
          Sorry, your mobile number verification was unsuccessful. Please try
          again.
        </Text>
        <View className="w-full rounded-lg p-6">
          <Btn
            width="100%"
            text="Try Again"
            onPress={() =>
              router.push(
                `/phoneVerification?phone=${encodeURIComponent(Array.isArray(phone) ? phone[0] : phone || "")}`
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Unsuccess;