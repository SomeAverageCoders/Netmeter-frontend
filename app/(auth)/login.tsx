import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import ImagePath from "../../constants/ImagePath";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    console.log("Login pressed with:", username, password);
  };

  const handleSignUp = () => {
    // Navigate to sign up screen
    console.log("Sign Up pressed");
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log("Forgot Password pressed");
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mb-10">
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
            Login
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="Username | Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-2"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handleForgotPassword}
            className="self-end mb-4"
          >
            <Text className="text-gray-700">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 py-3 px-4 rounded-full"
            onPress={handleLogin}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row mt-6">
          <Text className="text-gray-700">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.navigate("/(auth)/signup")}>
            <Text className="text-blue-500 font-semibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
