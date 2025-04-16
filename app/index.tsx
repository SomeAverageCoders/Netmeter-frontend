import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center"   >
      <Text className="text-5xl text-primary font-bold">Welcome!</Text>
      <Link href={"/login"} className="text-2xl text-blue-500 mt-4">
        Go to Login
      </Link>
      <Link href={"/(tabs)/profile"} className="text-2xl text-blue-500 mt-4">
        profile
      </Link>
    </View>
  );
}
