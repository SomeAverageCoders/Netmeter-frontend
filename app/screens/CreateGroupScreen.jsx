import { useState } from 'react';
import { View, StatusBar, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from "axios";
import { useUser } from "../../context/UserContext";

const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/users/search?name=${encodeURIComponent(searchQuery)}`
      );
      
      console.log('Search response:', response.data);
      
      // Handle different possible response structures
      let users = [];
      if (response.data.users) {
        users = response.data.users;
      } else if (response.data.data) {
        users = response.data.data;
      } else if (Array.isArray(response.data)) {
        users = response.data;
      }
      
      console.log('Processed users:', users);
      setSearchResults(users);
      
      if (users.length === 0) {
        Alert.alert('No Results', 'No users found matching your search');
      }
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      Alert.alert('Error', 'Failed to search users. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  // Add a user to the group
  const handleAddMember = (selectedUser) => {
    console.log('Adding member:', selectedUser);
    
    // Check if user is already selected
    if (selectedMembers.some(member => member.id === selectedUser.id)) {
      Alert.alert('Already Added', 'This user is already in the group');
      return;
    }
    
    // Check if trying to add themselves
    if (selectedUser.id === user.id) {
      Alert.alert('Cannot Add Yourself', 'You are automatically included as the group creator');
      return;
    }
    
    const newSelectedMembers = [...selectedMembers, selectedUser];
    setSelectedMembers(newSelectedMembers);
    setSearchQuery('');
    setSearchResults([]);
    
    console.log('Updated selected members:', newSelectedMembers);
  };

  // Remove a user from the group - Fixed function
  const handleRemoveMember = (userId) => {
    console.log('Removing member with ID:', userId);
    console.log('Current selected members:', selectedMembers);
    
    const updatedMembers = selectedMembers.filter(member => {
      console.log('Comparing:', member.id, 'with', userId, 'Equal?', member.id !== userId);
      return member.id !== userId;
    });
    
    console.log('Updated members after removal:', updatedMembers);
    setSelectedMembers(updatedMembers);
  };

  // Create the group and navigate back to home - Fixed function
  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please add at least one member to the group');
      return;
    }
    
    setCreatingGroup(true);
    
    try {
      // Collect all member IDs, including the creator
      const memberIds = [user.id, ...selectedMembers.map(m => m.id)];
      
      console.log('Creating group with data:', {
        name: groupName.trim(),
        memberIds,
        creatorId: user.id,
        totalMembers: memberIds.length
      });
      
      // Try the original endpoint first
      let response;
      try {
        response = await axios.post(
          `http://localhost:3000/groups/${user.id}`,
          {
            name: groupName.trim(),
            memberIds,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000 // 10 second timeout
          }
        );
      } catch (error) {
        console.log('First endpoint failed, trying alternative endpoint...');
      }
      
      console.log('Create group response:', response.data);
      
      // Check for successful response
      if (response.data && (response.data.name || response.data.id)) {
          setGroupName('');
          setSelectedMembers([]);
          setSearchQuery('');
          setSearchResults([]);
          // Navigate back
          router.replace('/(tabs)/Home');
      } else {
        console.error('Unexpected response structure:', response.data);
        Alert.alert('Error', 'Failed to create group. Please check server response.');
      }
    } catch (error) {
      console.error('Create group error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      let errorMessage = 'Failed to create group. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMessage = 'Request timeout. Please try again.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setCreatingGroup(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      {/* Header */ }
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
                  placeholder="Search by name"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  className={`ml-2 p-3 rounded-lg ${searching || searchQuery.trim() === '' ? 'bg-gray-400' : 'bg-blue-500'}`}
                  onPress={handleSearch}
                  disabled={searching || searchQuery.trim() === ''}
                >
                  <Ionicons name={searching ? "hourglass" : "search"} size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Search Status */}
            {searching && (
              <View className='bg-blue-50 p-3 rounded-lg mb-4'>
                <Text className='text-blue-600 text-center'>Searching for users...</Text>
              </View>
            )}
            
            {/* Search Results */}
            {!searching && searchResults.length > 0 && (
              <View className='mb-6'>
                <Text className='text-gray-700 text-base mb-3 font-medium'>
                  Search Results ({searchResults.length})
                </Text>
                <View className='max-h-48'>
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : `search-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className='bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between'
                        onPress={() => handleAddMember(item)}
                        activeOpacity={0.7}
                      >
                        <View className='flex-1'>
                          <Text className='text-base font-medium text-blue-800'>
                            {item.name || item.username || 'Unknown User'}
                          </Text>
                          {item.email && (
                            <Text className='text-sm text-blue-600 mt-1'>{item.email}</Text>
                          )}
                        </View>
                        <View className='bg-blue-500 px-3 py-1 rounded-full'>
                          <Text className='text-white text-xs font-medium'>Add</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={true}
                  />
                </View>
              </View>
            )}
            
            {/* No Results Message */}
            {!searching && searchQuery.trim() !== '' && searchResults.length === 0 && (
              <View className='bg-gray-50 p-4 rounded-lg mb-4'>
                <Text className='text-gray-600 text-center'>
                  No users found for "{searchQuery}"
                </Text>
              </View>
            )}
            
            {/* Selected Members */}
            <View className='mb-6'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>
                Selected Members ({selectedMembers.length})
              </Text>
              {selectedMembers.length === 0 ? (
                <View className='bg-gray-50 p-4 rounded-lg'>
                  <Text className='text-gray-500 italic text-center'>No members selected yet</Text>
                </View>
              ) : (
                <FlatList
                  data={selectedMembers}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View className='bg-white border border-gray-200 rounded-lg mb-2 p-4 flex-row justify-between items-center shadow-sm'>
                      <View className='flex-row items-center flex-1'>
                        <View className='h-10 w-10 rounded-full bg-green-100 items-center justify-center mr-3'>
                          <Text className='text-green-600 font-bold'>
                            {(item.name || item.username || 'U').charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View className='flex-1'>
                          <Text className='text-base font-medium'>
                            {item.name || item.username || 'Unknown User'}
                          </Text>
                          {item.email && (
                            <Text className='text-sm text-gray-500'>{item.email}</Text>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveMember(item.id)}
                        className='p-1'
                        activeOpacity={0.7}
                      >
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
              className={`py-4 rounded-lg items-center ${
                groupName.trim() && selectedMembers.length > 0 && !creatingGroup
                  ? 'bg-blue-500' 
                  : 'bg-gray-400'
              }`}
              onPress={handleCreateGroup}
              disabled={!groupName.trim() || selectedMembers.length === 0 || creatingGroup}
            >
              <Text className='text-white text-lg font-bold'>
                {creatingGroup 
                  ? 'Creating Group...' 
                  : `Create Group (${selectedMembers.length + 1} members)`
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateGroupScreen;