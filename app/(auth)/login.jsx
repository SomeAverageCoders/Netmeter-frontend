import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import ImagePath from "../../constants/ImagePath.js";
import Btn from "../../components/Btn.tsx";
import Input from "../../components/Input.tsx";
import { Link } from "expo-router";
import { useUser } from "../../context/UserContext";
import SHA256 from "crypto-js/sha256";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useUser();
  
  useEffect(() => {
    if (user) {
      console.log("User context updated:", user);
    }
  }, [user]);

  const handleForgotPassword = () => {
    // todo: Navigate to forgot password screen
    console.log("Forgot Password pressed");
  };

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Field!", "Please fill all the fields");
      return;
    }
    
    console.log("Login pressed", { email, password });
    
    const hashPassword = (password) => {
      return SHA256(password).toString();
    };

    const hashedPassword = hashPassword(password);
    console.log("Hashed Password:", hashedPassword);

    try {
      // Login request
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: hashedPassword,
      });

      console.log("Login successful:", response);
      const token = response.data.access_token;

      // Store token in AsyncStorage
      await AsyncStorage.setItem("access_token", token);

      // Decode JWT (simple base64 decode, no verification)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      const userId = decoded.sub;
      console.log(userId, "User ID from token");
      
      // Store user ID in AsyncStorage
      await AsyncStorage.setItem("user_id", userId);

      // Fetch user details
      const userRes = await axios.get(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("User details fetched:", userRes.data);
      
      // DEBUG: Log the entire response structure
      console.log("Full user response structure:", JSON.stringify(userRes.data, null, 2));
      
      // Create user object with all necessary data
      // The API response has the user data nested under 'data'
      const userDataFromAPI = userRes.data.data; // Access the nested data object
      
      const userData = {
        id: userDataFromAPI.id || userId,
        name: userDataFromAPI.name,
        email: userDataFromAPI.email,
        mobile: userDataFromAPI.mobile,
        userRole: userDataFromAPI.userRole,
        token: token, // Include token for future API calls
      };

      console.log("Prepared user data:", userData);

      // Validate that we have the essential data
      if (!userData.id || !userData.email) {
        console.error("Critical user data missing:", userData);
        Alert.alert("Error", "Unable to retrieve user information. Please try again.");
        return;
      }

      // Update user context (this will also save to AsyncStorage)
      await setUser(userData);
      
      console.log("User context updated with:", userData);
      
      // Small delay to ensure context is updated
      setTimeout(() => {
        // Navigate to home after successful login and context update
        router.replace("/(tabs)/Home");
      }, 100);
      
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        // Server responded with error
        console.error("Error response data:", error.response.data);
        Alert.alert(
          "Login Failed",
          error.response.data.message || "Please check your credentials."
        );
      } else if (error.request) {
        // Network error
        Alert.alert(
          "Network Error",
          "Please check your internet connection."
        );
      } else {
        // Other error
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again."
        );
      }
    }
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
            Login
          </Text>
          <Input placeholder="Email" value={email} onChange={setemail} />
          <Input
            placeholder="Password"
            password
            value={password}
            onChange={setPassword}
          />
          <TouchableOpacity
            onPress={handleForgotPassword}
            className="self-end mb-4"
          >
            <Text className="text-gray-700">Forgot Password?</Text>
          </TouchableOpacity>
          <Btn width="100%" text="Login" onPress={onLogin} />
        </View>
        <View className="flex-row mt-6">
          <Text className="text-gray-700">Don't have an account? </Text>
          <Link href={"/(auth)/signup"}>
            <Text className="text-blue-500 font-bold">Sign up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;