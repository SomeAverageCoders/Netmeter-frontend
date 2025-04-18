import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from "react-native";
import { useRouter } from 'expo-router';
import ImagePath from "../../constants/ImagePath";

const signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // Navigate to sign up screen
    console.log("Sign Up pressed");
  };

  const handleClear = () => {
    // Navigate to sign up screen
    console.log("Claer pressed");
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mb-6">
          <View className="mb-4">
            <Image
              source={ImagePath.Logo}
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="w-full bg-gray-100 rounded-lg p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Sign Up
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="Mobile Number"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-8"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="bg-blue-500 py-3 px-4 rounded-full mb-2"
            onPress={handleSignUp}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text className="text-blue-500 text-center text-lg font-semibold">
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Section */}
        <View className="flex-row mt-6">
          <Text className="text-gray-700">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.navigate('/(auth)/login')}>
                <Text className="text-blue-500 font-semibold">Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default signup;

const styles = StyleSheet.create({
    clearButton: {
      backgroundColor: '#ddecff', 
      paddingVertical: 12, 
      paddingHorizontal: 16, 
      borderRadius: 9999, 
      marginBottom: 8, 
      borderWidth: 1,
      borderColor: '#3B82F6', 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 2,
    }
  });
