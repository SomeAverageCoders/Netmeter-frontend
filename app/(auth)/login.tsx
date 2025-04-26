import React, { useState, useContext } from "react";
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
import ImagePath from "../../constants/ImagePath";
import Btn from "../../components/Btn";
import Input from "../../components/Input";
import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api.js";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const convex = useConvex();
  const { setUser } = useContext(UserContext);

  const handleForgotPassword = () => {
    // todo: Navigate to forgot password screen
    console.log("Forgot Password pressed");
  };

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert("Missing Field!", "Please fill all the fields");
      return;
    }
    console.log("Login pressed", { email, password });
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userData = await convex.query(api.Users.GetUserByEmail, {
          email: email,
        });
        console.log("User data from convex:", userData);
        setUser(userData);
        router.replace("/(tabs)/Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode + " " + errorMessage);
        Alert.alert(
          "Incorrect Credentials",
          "Please check your email and password."
        );
      });
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