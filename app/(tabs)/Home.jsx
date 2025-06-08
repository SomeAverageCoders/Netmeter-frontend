import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import ImagePath from "../../constants/ImagePath";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const fetchUserGroups = async () => {
    if (!user || !user.id) return;

    setLoadingGroups(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      // Fetch groups
      const response = await axios.get(`http://localhost:3000/groups/get/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const groupsData = response.data;

      // Fetch member count for each group in parallel
      const groupsWithCounts = await Promise.all(
        groupsData.map(async (group) => {
          try {
            const countRes = await axios.get(`http://localhost:3000/groups/${group.id}/member-count`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Member count for group ${group.id}:`, countRes.data.memberCount);
            return { ...group, memberCount: countRes.data.memberCount || 0 };
          } catch (err) {
            return { ...group, memberCount: 0 };
          }
        })
      );

      setGroups(groupsWithCounts);

    } catch (error) {
      if(error.response?.status === 404){
        console.log("Groups Not found");
      }
      else if (error.response?.status === 401) {
        console.log("Token expired, redirecting to login");
        router.replace("/(auth)/login");
      } else {
        console.log("Error: ", error.message);
      }
    } finally {
      setLoadingGroups(false);
    }
  };
  
  // Fetch groups when user data is available
  useEffect(() => {
    if (user) {
      console.log('User data available:', user);
      fetchUserGroups();
    } else if (!isLoading) {
      console.log('No user data and not loading, redirecting to login');
      router.replace("/(auth)/login");
    }
  }, [user, isLoading]);

  const handleCreateGroup = () => {
    router.push('/screens/CreateGroupScreen');
  };

  const handleGroupPress = (group) => {
    console.log('Group Pressed:', group);
    router.push(`/screens/Groups/${group.id}`);
  };

  // Show loading spinner while checking user authentication
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no user after loading, redirect to login
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Redirecting to login...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const NewUserView = () => (
    <View className='flex-1 items-center justify-center p-4'>
       <View className='mb-8'>
        <Image 
          source={ImagePath.TeamSVG} 
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </View> 
      <TouchableOpacity 
        className='w-full bg-blue-500 py-4 px-6 rounded-full mb-4 items-center'
        onPress={handleCreateGroup}
      >
        <Text className='text-white text-lg font-bold'>Create a Group</Text>
      </TouchableOpacity>
    </View>
  );

  // For existing users with groups
  const ExistingUserView = () => (
    <View className='flex-1 items-center p-4'>
       <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4 relative w-full">
      <Text className='text-lg font-bold text-blue-500 mb-4'>Your Groups</Text>
      
      {loadingGroups ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Loading groups...</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className='my-2 bg-white rounded-lg shadow'
              onPress={() => handleGroupPress(item)}
            >
              <View className='p-4 border-b border-gray-200 '>
                <Text className='text-lg font-bold text-blue-500'>{item.name}</Text>
                <Text className='text-gray-600'>{item.memberCount || 1} members</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-gray-600">No groups found</Text>
              <Text className="text-gray-500 text-sm">Create your first group to get started</Text>
            </View>
          }
        />
      )}
      </View>
      <TouchableOpacity 
        className='absolute bottom-6 right-6 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg'
        onPress={handleCreateGroup}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <View className="flex-1">
          <View className="bg-blue-500 py-4">
              <Text className="text-white text-xl font-bold text-center">
                Welcome, {user.name || 'User'}
              </Text>
            </View>
          {/* Conditional rendering based on user status */}
          {groups.length === 0 && !loadingGroups ? <NewUserView /> : <ExistingUserView />}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});