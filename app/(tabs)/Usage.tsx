import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import MyUsage from '../screens/MyUsage';
import GroupUsage from '../screens/GroupUsage';
import { router } from 'expo-router';
import { useUser } from "../../context/UserContext";

interface Group {
  id: string;
  name: string;
}

const Usage = () => {
  const { user, isLoading } = useUser();
  const [activeUsageTab, setActiveUsageTab] = useState<'my' | 'group'>('my');
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!user?.id) return;

      try {
        setLoadingGroups(true);
        setError(null);
        // const token = await getStoredToken(); // You need to implement this function
        
        const response = await axios.get(`http://localhost:3000/groups/get/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const fetchedGroups = response.data;
        setGroups(fetchedGroups);
        
        // Select the first group as default if groups exist
        if (fetchedGroups.length > 0) {
          setSelectedGroup(fetchedGroups[0]);
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
        setError('Failed to load groups');
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchUserGroups();
  }, [user?.id]);

  const handleCheckBillShare = () => {
    console.log('Navigate to Bill Share');
    router.push(`/screens/MyQuota/${user.id}`);
  };

  const handleCheckBillSummary = () => {
    console.log('Navigate to Bill Summary');
    router.push(`/screens/BillingHistory`);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setGroupModalVisible(false);
  };

  // Show loading state while fetching groups
  if (isLoading || loadingGroups) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Loading groups...</Text>
      </SafeAreaView>
    );
  }

  // Show error state if groups failed to load
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center px-4">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-2 text-red-600 text-center font-medium">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
          onPress={() => {
            setError(null);
            setLoadingGroups(true);
            // Retry fetching groups
          }}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Show message if no groups found
  if (groups.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center px-4">
        <Ionicons name="people-outline" size={48} color="#6B7280" />
        <Text className="mt-2 text-gray-600 text-center font-medium">
          No groups found
        </Text>
        <Text className="mt-1 text-gray-500 text-center">
          Join or create a group to view usage data
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header with group selector */}
      <View className="bg-blue-500 py-4 px-4 flex-row items-center justify-center">
        {/* Group selector */}
        <TouchableOpacity
          className="flex-row items-center mr-2 bg-blue-400 px-3 py-1 rounded-full"
          onPress={() => setGroupModalVisible(true)}
        >
          <Text className="text-white text-lg font-bold mr-1">
            {selectedGroup ? selectedGroup.name.slice(0, 2) : 'GR'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold text-center flex-1">
          {activeUsageTab === 'my' ? 'Personal Usage' : 'Usage Summary'}
        </Text>
      </View>

      {/* Group selection modal */}
      <Modal
        visible={groupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
          <View className="bg-white rounded-xl p-4 w-72">
            <Text className="text-lg font-bold mb-4 text-center">Select Group</Text>
            <FlatList
              data={groups}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-3 px-4 rounded-lg mb-2 ${
                    item.id === selectedGroup?.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                  onPress={() => handleSelectGroup(item)}
                >
                  <Text className="text-base text-gray-800 font-semibold">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="mt-2 py-2 rounded-lg items-center bg-gray-200"
              onPress={() => setGroupModalVisible(false)}
            >
              <Text className="text-gray-700 font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Usage Type Tabs */}
      <View className="bg-white px-4 shadow-sm">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveUsageTab('my')}
            className={`flex-1 py-3 border-b-2 ${
              activeUsageTab === 'my'
                ? 'border-blue-500 bg-blue-50'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeUsageTab === 'my' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              My USAGE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveUsageTab('group')}
            className={`flex-1 py-3 border-b-2 ${
              activeUsageTab === 'group'
                ? 'border-blue-500 bg-blue-50'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeUsageTab === 'group' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              Group USAGE
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render the appropriate component based on active tab, pass selectedGroup as prop */}
      {selectedGroup && (
        <>
          {activeUsageTab === 'my' ? (
            <MyUsage onCheckBillShare={handleCheckBillShare} group={selectedGroup} />
          ) : (
            <GroupUsage onCheckBillSummary={handleCheckBillSummary} group={selectedGroup} />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Usage;