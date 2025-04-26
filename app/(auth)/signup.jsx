import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import SHA256 from "crypto-js/sha256";
import { useRouter } from "expo-router";
import ImagePath from "../../constants/ImagePath";
import Btn from "../../components/Btn";
import Input from "../../components/Input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useSignupData } from "../../context/UserSignupDataContext";

const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setSignupData } = useSignupData();

  const hashPassword = (password) => {
    return SHA256(password).toString();
  };

  const onSignUp = () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const firebaseUser = userCredential.user;
        console.log("User signed up:", firebaseUser);
        if (firebaseUser) {
          const passwordHash = hashPassword(password);
          console.log("Password hash:", passwordHash);
          const formattedPhone = "+94" + phone.slice(1);
          setSignupData({
            name: username,
            phone: formattedPhone,
            email,
            passwordHash,
          });
          console.log("Saved signup data to context: phone number is ", phone);
          router.push(
            `/phoneVerification?phone=${encodeURIComponent(formattedPhone)}`
          );
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing up:", errorCode, errorMessage);
      });
  };

  const handleClear = () => {
    setUsername("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mb-2">
          <View className="mb-2">
            <Image
              source={ImagePath.Logo}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View className="w-full bg-gray-100 rounded-lg p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create New Account
          </Text>
          <Input
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <Input placeholder="Email" value={email} onChange={setEmail} />
          <Input
            placeholder="Mobile Number"
            value={phone}
            onChange={setPhone}
          />
          <Input
            placeholder="Password"
            password
            value={password}
            onChange={setPassword}
          />
          <Input
            placeholder="Confirm Password"
            password
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <Btn width="100%" text="Sign Up" onPress={onSignUp} />
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text className="text-blue-500 text-center text-lg font-semibold">
              Clear
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row mt-6">
          <Text className="text-gray-700">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.navigate("/(auth)/login")}>
            <Text className="text-blue-500 font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  clearButton: {
    backgroundColor: "#ddecff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 9999,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3B82F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});
