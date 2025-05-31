import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import ImagePath from "../../constants/ImagePath";
// or if you're using a local SVG file

const mockUser = {
  isNewUser: false,
  username: 'JohnDoe',
};

const mockGroups = [
  {
    id: '1',
    name: 'Uni Bording',
    members: [
      { id: '1', username: 'Rehan_123', devices: ['Galaxy A10-9867q', 'Dell aspire 5433', 'Iphone 8'] },
      { id: '2', username: 'Kevin_4J', devices: [] },
      { id: '3', username: 'Nikil_Fer', devices: [] },
      { id: '4', username: 'Peter_parker', devices: [] },
      { id: '5', username: 'jihan new', devices: [] },
    ],
  },
  {
    id: '2',
    name: 'Test Bording',
    members: [
      { id: '1', username: 'Rehan_123', devices: ['Galaxy A10-9867q', 'Dell aspire 5433', 'Iphone 8'] },
      { id: '2', username: 'Kevin_4J', devices: [] },
      { id: '3', username: 'Nikil_Fer', devices: [] },
      { id: '4', username: 'Peter_parker', devices: [] },
      { id: '5', username: 'jihan new', devices: [] },
    ],
  },
];

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState(mockUser);
  type Group = {
    id: string;
    name: string;
    members: {
      id: string;
      username: string;
      devices: string[];
    }[];
  };
  
  const [groups, setGroups] = useState<Group[]>([]);
  
  // Simulate fetching user data and groups
  useEffect(() => {
    // In real app, you would fetch from API
    setUser(mockUser);
    setGroups(mockUser.isNewUser ? [] : mockGroups);
  }, []);

  const handleCreateGroup = () => {
    router.push('/screens/CreateGroupScreen' as any);
  };

  const handleGroupPress = (group: any) => {
    console.log('Group Pressed:', group);
    // router.push(`/screens/ManageGroup/${group.name}` as any);
    router.push(`/screens/Groups/1` as any);
  };

  const handleSetupWifi = () => {
    console.log('Setup Wi-Fi Configurations Pressed');
  };

  const NewUserView = () => (
    <View className='flex-1 items-center justify-center p-4'>
       <View className='mb-8'>
        <Image 
          source={ImagePath.TeamSVG} 
          style={{ width: 400, height: 400 }}
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
              <Text className='text-gray-600'>{item.members.length} members</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
      <StatusBar barStyle="dark-content" />
      <View className="flex-1">
          <View className="bg-blue-500 py-4 mt-4">
              <Text className="text-white text-xl font-bold text-center">
                Home
              </Text>
            </View>
          {/* Conditional rendering based on user status */}
          {groups.length === 0 ? <NewUserView /> : <ExistingUserView />}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({})