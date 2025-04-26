import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Alert,
} from "react-native";
import Btn from "../../components/Btn";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { UserContext } from "../../context/UserContext";

const Profile = () => {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const signout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        Alert.alert("Sign Out", "You have been signed out successfully.");
        router.replace("/(auth)/login");
      })
      .catch((error) => {
        Alert.alert("Sign Out Error", error.message);
      });
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-xl text-blue-500 mb-6 text-center font-semibold">
          Profile
        </Text>
        <View className="w-full mt-6">
          <Btn width="100%" text="Sign Out" onPress={signout} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
