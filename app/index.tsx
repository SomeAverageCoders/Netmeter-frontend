import { useRouter } from "expo-router";
import { SafeAreaView, StatusBar, Text, View, Animated, Easing } from "react-native";
import { useEffect, useRef, useContext } from "react";
import ImagePath from "../constants/ImagePath";
import Btn from "../components/Btn";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { UserContext } from "../context/UserContext";
import { useConvex } from "convex/react";
import { api } from "../convex/_generated/api.js";
import { Link } from "@react-navigation/native";

export default function Index() {
  const router = useRouter();
  const spinValue = useRef(new Animated.Value(0)).current;
  const { setUser } = useContext(UserContext);
  const convex = useConvex();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async(userInfo)=>{
  //     if (userInfo) {
  //       try {
  //         console.log("User email:", userInfo.email);
      
  //         const userData = await convex.query(api.Users.GetUserByEmail, {
  //           email: userInfo?.email ?? "",
  //         });
      
  //         console.log("User data from convex:", userData);
  //         setUser(userData);
  //         router.replace("/(tabs)/Home");
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     }
  //   })
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  
  
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