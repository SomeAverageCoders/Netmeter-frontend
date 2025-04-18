import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { StyleSheet } from 'react-native';

export default function AdminCheckScreen() {
  const handleYes = () => {
    // Handle yes response
    console.log("Yes pressed");
  };

  const handleNo = () => {
    // Handle no response
    console.log("No pressed");
  };

  const handleSetUpLater = () => {
    // Handle set up later
    console.log("Set Up Later pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-gray-100 rounded-xl p-6 w-[90%] items-center mb-6">
          <Text className="text-xl font-semibold text-gray-600 mb-6">Are you a group admin?</Text>
          
          <View className="flex-row justify-center w-full space-x-4">
            <TouchableOpacity
              style={styles.NoBtn}
              onPress={handleNo}
            >
              <Text className="text-blue-500 text-center text-lg font-bold">No</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-blue-500 py-3 px-4 w-4/12 rounded-full mb-2"
              onPress={handleYes}
            >
              <Text className="text-white text-center text-lg font-semibold">Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text className="text-base text-gray-600 text-center mb-10 max-w-xs">
          You can skip this and set up your account type later via settings
        </Text>
        <TouchableOpacity
                  className="bg-blue-500 py-3.5 px-5 rounded-full w-4/5 items-center justify-center shadow"
                  onPress={handleSetUpLater}
                >
                  <Text className="text-white text-lg font-semibold">Set Up Later</Text>
                </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  NoBtn: {
    backgroundColor: '#ddecff', 
    paddingVertical: 12, 
    paddingHorizontal: 16,  
    marginBottom: 8, 
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 9999, 
    borderColor: '#3B82F6', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    width: '33.333%',
  }
});