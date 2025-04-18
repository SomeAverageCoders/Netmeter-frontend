import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Unsuccess = () => {
    const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <View className="flex-1 items-center justify-center px-5">
        <View className="mb-5">
          <View className="w-24 h-24 rounded-full border-2 border-red-600 items-center justify-center">
            <Ionicons name="close" size={60} color="#ec1515" />
          </View>
        </View>
        
        <Text className="text-2xl font-bold text-red-600 mb-3">Verification Failed!</Text>
        
        <Text className="text-base text-gray-600 text-center mb-10 max-w-xs">
          Sorry, your mobile number verification was unsuccessful. Please try again.
        </Text>
        
        <TouchableOpacity
          className="bg-blue-500 py-3.5 px-5 rounded-full w-4/5 items-center justify-center shadow"
          onPress={() => router.navigate('/(auth)/otp')}
        >
          <Text className="text-white text-lg font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Unsuccess

const styles = StyleSheet.create({})