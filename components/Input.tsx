import { TextInput } from "react-native";
import React from "react";

export default function Btn({
  placeholder,
  password=false,
  value,
  onChange,
}: {
  placeholder: string;
  password?: boolean;
  value: string;
  onChange: (text: string) => void
}) {
  return (
    <TextInput
      className="bg-white border border-gray-200 rounded-md p-4 mb-4"
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
      secureTextEntry={password}
    />
  );
}
