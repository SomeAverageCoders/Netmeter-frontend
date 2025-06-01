import React, { useState } from 'react';
import { View, StatusBar, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
// import axios from 'axios';

const CreateGroupScreen = () => {
  const navigation = useNavigation();

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null); // Only one user result
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searching, setSearching] = useState(false);

  // Search for users via API
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResult(null);
      return;
    }
    setSearching(true);
    // try {
    //   // Replace with your actual API endpoint
    //   const response = await axios.get(`https://your-api-url.com/users/search?username=${encodeURIComponent(searchQuery)}`);

    //   if (response.data && response.data.user) {
    //     setSearchResult(response.data.user);
    //   } else {
    //     setSearchResult(null);
    //     Alert.alert('Not found', 'No user found with that username');
    //   }
    // } catch (error) {
    //   setSearchResult(null);
    //   Alert.alert('Error', 'Failed to search user');
    // } finally {
    //   setSearching(false);
    // }
    const mockUsers = [
        { id: '1', username: 'alice' },
        { id: '2', username: 'bob' },
        { id: '3', username: 'charlie' },
        { id: '4', username: 'david' },
        { id: '5', username: 'eve' },
      ];
      const foundUser = mockUsers.find(
        user => user.username.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      const response = {
        data: {
          user: foundUser || null,
        },
      };
      setSearchResult(response.data.user);
      setSearching(false);
  };

  // Add a user to the group
  const handleAddMember = (user) => {
    if (!selectedMembers.some(member => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setSearchQuery('');
    setSearchResult(null);
  };

  // Remove a user from the group
  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(member => member.id !== userId));
  };

  // Create the group and navigate back to home
  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please add at least one member to the group');
      return;
    }
    try {
      // Replace with your actual API endpoint
      // const response = await axios.post('https://your-api-url.com/groups', {
      //   name: groupName,
      //   members: selectedMembers.map(m => m.id),
      // });
      // Mock response for testing
      const response2 = {
        data: {
          success: true,
          group: {
        id: 'mock-group-id',
        name: groupName,
        members: selectedMembers,
          },
        },
      };
      if (response2.data && response2.data.success) {
        Alert.alert('Success', 'Group created successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/Home'),
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to create group');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create group');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      {/* Header */}
      <View className="bg-blue-500 p-4">
        <View className="justify-center items-center relative">
          <TouchableOpacity
            className="absolute left-0"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold text-center">
            Create Group
          </Text>
        </View>
      </View>
      <View className='flex-1 items-center p-4'>
        {/* Group Name Input */}
        <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4 relative w-full">
          <View className='bg-white rounded-lg shadow-sm p-4 mb-4'>
            <View className='mb-6'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>Group Name</Text>
              <TextInput
                className='bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg'
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
            {/* Search Users */}
            <View className='mb-6'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>Add Members</Text>
              <View className='flex-row items-center'>
                <TextInput
                  className='flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg'
                  placeholder="Search by username"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  className='ml-2 bg-blue-500 p-3 rounded-lg'
                  onPress={handleSearch}
                  disabled={searching || searchQuery.trim() === ''}
                >
                  <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            {/* Search Result */}
            {searching && (
              <Text className='text-gray-500 mb-2 text-center'>Searching...</Text>
            )}
            {searchResult && (
              <TouchableOpacity
                className='bg-gray-100 py-3 px-4 rounded-lg mb-4 items-center'
                onPress={() => handleAddMember(searchResult)}
              >
                <Text className='text-base font-medium text-blue-700'>
                  {searchResult.username}
                </Text>
                <Text className='text-xs text-gray-500'>Tap to add</Text>
              </TouchableOpacity>
            )}
            {/* Selected Members */}
            <View className='mb-6'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>
                Selected Members ({selectedMembers.length})
              </Text>
              {selectedMembers.length === 0 ? (
                <Text className='text-gray-500 italic'>No members selected</Text>
              ) : (
                <FlatList
                  data={selectedMembers}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View className='bg-white rounded-lg mb-2 p-4 flex-row justify-between items-center shadow-sm'>
                      <View className='flex-row items-center'>
                        <View className='h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3'>
                          <Text className='text-blue-500 font-bold'>{item.username.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text className='text-lg'>{item.username}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
                        <Ionicons name="close-circle" size={24} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
            </View>
          </View>
          {/* Create Group Button */}
          <View className='p-4 bg-white border-t border-gray-200'>
            <TouchableOpacity
              className='bg-blue-500 py-4 rounded-lg items-center'
              onPress={handleCreateGroup}
            >
              <Text className='text-white text-lg font-bold'>Create Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateGroupScreen;