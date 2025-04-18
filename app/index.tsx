import { Link } from "expo-router";
import { SafeAreaView, StatusBar, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import ImagePath from "../constants/ImagePath";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mb-2">
          <View className="mb-2">
            <Image
              source={ImagePath.Logo}
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text className="text-2xl text-blue-500 mb-6 text-center font-semibolt">Fair and smart Wi-Fi usage tracking and billing for shared networks</Text>
        <View className="flex-row mt-6">
          <TouchableOpacity onPress={() => router.navigate('/(auth)/signup')} style={styles.SignupBtn}>
                <Text className="text-blue-500 font-semibold text-center">Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate('/(auth)/login')} className="bg-blue-500 py-3 px-4 w-4/12 rounded mb-2">
                <Text className="text-white font-bold text-center">Login</Text>
          </TouchableOpacity>
        </View>
        <Link href={"/(tabs)/profile"} className="text-2xl text-blue-500 mt-4">
          profile
        </Link>
        <Link href={"/(auth)/success"} className="text-2xl text-blue-500 mt-4">
          success
        </Link>
        <Link href={"/(auth)/unsuccess"} className="text-2xl text-blue-500 mt-4">
          unsuccess
        </Link>
        <Link href={"/(auth)/admincheck"} className="text-2xl text-blue-500 mt-4">
          group admin check
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SignupBtn: {
    backgroundColor: '#ddecff', 
    paddingVertical: 12, 
    paddingHorizontal: 16,  
    marginBottom: 8, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#3B82F6', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    width: '33.333%',  // This is equivalent to w-4/12
    borderRadius: 4,   // This is equivalent to rounded
  }
});
