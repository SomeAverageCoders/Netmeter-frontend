import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MyUsage from '../screens/MyUsage';
import GroupUsage from '../screens/GroupUsage';

const Usage = () => {
  const [activeUsageTab, setActiveUsageTab] = useState<'my' | 'group'>('my');

  const handleCheckBillShare = () => {
    // Handle bill share navigation
    console.log('Navigate to Bill Share');
  };

  const handleCheckBillSummary = () => {
    // Handle bill summary navigation
    console.log('Navigate to Bill Summary');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <View className="bg-blue-500 py-4 px-4">
        <Text className="text-white text-xl font-bold text-center">
          {activeUsageTab === 'my' ? 'Personal Usage' : 'Usage Summary'}
        </Text>
      </View>

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

      {/* Render the appropriate component based on active tab */}
      {activeUsageTab === 'my' ? (
        <MyUsage onCheckBillShare={handleCheckBillShare} />
      ) : (
        <GroupUsage onCheckBillSummary={handleCheckBillSummary} />
      )}
    </SafeAreaView>
  );
};

export default Usage;