import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';

const MyQuota = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const groupId = route.params?.groupId;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userQuotaData, setUserQuotaData] = useState(null);

  // Mock data for current user quota
  const mockUserQuotaData = {
    totalBill: 2450.00,
    totalGroupUsage: 148.26,
    userDataUsage: 9.19,
    userBillShare: 151.86,
    overage: 0.00
  };

  useEffect(() => {
    // Simulate API call based on selected date
    setUserQuotaData(mockUserQuotaData);
  }, [selectedDate]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const navigateToBillingHistory = () => {
    navigation.navigate('BillingHistory', { groupId });
  };

  if (!userQuotaData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
        <View className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            My Quota
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Date Section */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-lg text-gray-600">
            {formatDate(selectedDate)}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center"
          >
            <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
            <Text className="text-blue-500 ml-1">Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Quota Summary Card */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Total Bill */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <Text className="text-base text-gray-600">Total Bill for Month:</Text>
            <Text className="text-xl font-bold text-gray-800">
              {userQuotaData.totalBill.toFixed(2)} ₹
            </Text>
          </View>

          {/* Total Group Usage */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <Text className="text-base text-gray-600">Total Data Used by Group:</Text>
            <Text className="text-lg font-medium text-gray-800">
              {userQuotaData.totalGroupUsage} GB
            </Text>
          </View>

          {/* User Data Usage */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <Text className="text-base text-gray-600">Your Data Usage:</Text>
            <Text className="text-lg font-medium text-blue-600">
              {userQuotaData.userDataUsage} GB
            </Text>
          </View>

          {/* User Bill Share */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <Text className="text-base text-gray-600">Your Bill:</Text>
            <Text className="text-xl font-bold text-green-600">
              {userQuotaData.userBillShare.toFixed(2)} LKR
            </Text>
          </View>

          {/* Overage Charges */}
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-gray-600">Overage Charges:</Text>
            <Text className={`text-lg font-medium ${userQuotaData.overage > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {userQuotaData.overage.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Usage Statistics Card */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <Text className="text-lg font-bold mb-4 text-gray-800">
            Usage Statistics
          </Text>
          
          {/* Usage Percentage */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Your Usage Share</Text>
              <Text className="text-gray-800 font-medium">
                {((userQuotaData.userDataUsage / userQuotaData.totalGroupUsage) * 100).toFixed(1)}%
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-3">
              <View 
                className="bg-blue-500 h-3 rounded-full"
                style={{ 
                  width: `${(userQuotaData.userDataUsage / userQuotaData.totalGroupUsage) * 100}%` 
                }}
              />
            </View>
          </View>

          {/* Bill Share Percentage */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Your Bill Share</Text>
              <Text className="text-gray-800 font-medium">
                {((userQuotaData.userBillShare / userQuotaData.totalBill) * 100).toFixed(1)}%
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-3">
              <View 
                className="bg-green-500 h-3 rounded-full"
                style={{ 
                  width: `${(userQuotaData.userBillShare / userQuotaData.totalBill) * 100}%` 
                }}
              />
            </View>
          </View>
        </View>

        {/* View Billing History Button */}
        <TouchableOpacity 
          className="bg-blue-500 py-4 rounded-lg items-center mb-6"
          onPress={navigateToBillingHistory}
        >
          <Text className="text-white font-bold text-lg">View Billing History</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default MyQuota;