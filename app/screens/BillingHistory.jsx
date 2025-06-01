import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BillingHistory = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const groupId = route.params?.groupId;
  const [billingHistory, setBillingHistory] = useState([]);

  // Mock billing history data
  const mockBillingHistory = [
    {
      id: '1',
      month: 'Oct 2024',
      monthlyUsage: 9.19,
      billShare: 151.86
    },
    {
      id: '2',
      month: 'Sep 2024',
      monthlyUsage: 12.45,
      billShare: 198.50
    },
    {
      id: '3',
      month: 'Aug 2024',
      monthlyUsage: 8.75,
      billShare: 142.30
    },
    {
      id: '4',
      month: 'Jul 2024',
      monthlyUsage: 15.20,
      billShare: 245.80
    },
    {
      id: '5',
      month: 'Jun 2024',
      monthlyUsage: 11.80,
      billShare: 189.95
    },
    {
      id: '6',
      month: 'May 2024',
      monthlyUsage: 10.35,
      billShare: 165.20
    },
    {
      id: '7',
      month: 'Apr 2024',
      monthlyUsage: 13.90,
      billShare: 225.40
    },
    {
      id: '8',
      month: 'Mar 2024',
      monthlyUsage: 9.60,
      billShare: 155.75
    }
  ];

  useEffect(() => {
    setBillingHistory(mockBillingHistory);
  }, []);

  const renderHistoryItem = ({ item, index }) => (
    <View 
      className={`flex-row p-4 ${index !== billingHistory.length - 1 ? 'border-b border-gray-100' : ''}`}
    >
      {/* Month Column */}
      <View className="flex-1 justify-center">
        <Text className="text-base font-medium text-gray-800">
          {item.month}
        </Text>
      </View>

      {/* Usage Column */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">
          {item.monthlyUsage} GB
        </Text>
      </View>

      {/* Bill Share Column */}
      <View className="flex-1 justify-center items-end">
        <Text className="text-base font-semibold text-green-600">
          {item.billShare.toFixed(2)} LKR
        </Text>
      </View>
    </View>
  );

  const getTotalUsage = () => {
    return billingHistory.reduce((sum, item) => sum + item.monthlyUsage, 0).toFixed(2);
  };

  const getTotalBillShare = () => {
    return billingHistory.reduce((sum, item) => sum + item.billShare, 0).toFixed(2);
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
             Billing History
          </Text>
        </View>
      </View>

      <View className="flex-1">
        {/* Summary Cards */}
        <View className="flex-row p-4 space-x-4">
          <View className="flex-1 bg-blue-50 rounded-xl p-4">
            <Text className="text-blue-600 text-sm font-medium">Total Usage</Text>
            <Text className="text-blue-800 text-xl font-bold">
              {getTotalUsage()} GB
            </Text>
          </View>
          
          <View className="flex-1 bg-green-50 rounded-xl p-4">
            <Text className="text-green-600 text-sm font-medium">Total Paid</Text>
            <Text className="text-green-800 text-xl font-bold">
              {getTotalBillShare()} LKR
            </Text>
          </View>
        </View>

        {/* History Table */}
        <View className="flex-1 bg-white rounded-t-xl shadow-sm mx-4 mb-4">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">
              Monthly History
            </Text>
          </View>
          
          {/* Table Header */}
          <View className="flex-row bg-gray-50 p-4 border-b border-gray-200">
            <Text className="flex-1 font-semibold text-gray-700">Month</Text>
            <Text className="flex-1 font-semibold text-gray-700 text-center">Monthly Usage</Text>
            <Text className="flex-1 font-semibold text-gray-700 text-right">Bill Share</Text>
          </View>

          {/* Table Content */}
          <FlatList
            data={billingHistory}
            keyExtractor={(item) => item.id}
            renderItem={renderHistoryItem}
            showsVerticalScrollIndicator={false}
            className="flex-1"
          />
        </View>

        {/* Back Button */}
        <View className="p-4">
          <TouchableOpacity 
            className="bg-gray-600 py-4 rounded-lg items-center"
            onPress={() => router.push('screens/MyQuota/1')}
          >
            <Text className="text-white font-bold text-lg">Back to My Quota</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BillingHistory;