import { Text, TouchableOpacity } from "react-native";
import React from "react";

export default function Btn ({ width, text, onPress }: { width: string; text: string; onPress: () => void }){
  return (
    <TouchableOpacity
      className={`bg-blue-500 py-3 px-4 rounded-full ${width || "w-full"}`}
      onPress={onPress}
    >
      <Text className="text-white text-center text-lg font-semibold">
        {text}
      </Text>
    </TouchableOpacity>
  );
};
