import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
;
const BillingSummary = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const groupId = route.params?.id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalBill, setTotalBill] = useState(2450.00);
  const [showEditBillModal, setShowEditBillModal] = useState(false);
  const [editBillAmount, setEditBillAmount] = useState('2450.00');
  const [billingData, setBillingData] = useState(null);

  // Mock data for billing
  const mockBillingData = {
    totalDataUsed: 148.26,
    monthlyCharge: 2450.00, // Fixed monthly charge from WiFi plan
    hasFixedCharge: true,
    members: [
      { id: '1', username: 'Rehan_123', dataUsage: 9.19, billAmount: 151.86 },
      { id: '2', username: 'Kevin_4J', dataUsage: 19.00, billAmount: 313.98 },
      { id: '3', username: 'Nikil_fer', dataUsage: 35.25, billAmount: 582.50 },
      { id: '4', username: 'Jihan', dataUsage: 16.36, billAmount: 270.35 },
      { id: '5', username: 'Peter_Parker', dataUsage: 52.76, billAmount: 838.81 },
      { id: '6', username: 'Perera_mj', dataUsage: 17.70, billAmount: 292.49 }
    ]
  };

  useEffect(() => {
    setBillingData(mockBillingData);
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

  const handleEditBill = () => {
    const newAmount = parseFloat(editBillAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    setTotalBill(newAmount);
    // Recalculate bill distribution based on usage percentage
    const updatedMembers = billingData.members.map(member => {
      const usagePercentage = member.dataUsage / billingData.totalDataUsed;
      return {
        ...member,
        billAmount: parseFloat((newAmount * usagePercentage).toFixed(2))
      };
    });
    
    setBillingData({
      ...billingData,
      members: updatedMembers
    });
    
    setShowEditBillModal(false);
  };

  const generateChartData = () => {
    if (!billingData) return [];
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    return billingData.members.map((member, index) => ({
      name: member.username,
      amount: member.billAmount,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
  };

  const navigateToMyQuota = () => {
    navigation.navigate('MyQuota', { groupId });
  };

  if (!billingData) {
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
            Billing Summary
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

        {/* Total Bill Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Total Bill for Month:</Text>
            <View className="flex-row items-center">
              <Text className="text-lg font-bold mr-2">
                {totalBill.toFixed(2)} LKR
              </Text>
              <TouchableOpacity 
                onPress={() => setShowEditBillModal(true)}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                <Text className="text-white text-sm">Change</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-gray-500 text-sm">
            Total Data Used by Group: {billingData.totalDataUsed} GB
          </Text>
        </View>

        {/* Chart Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-lg font-bold mb-4 text-gray-800">
            Group Members' Usage & Bill Distribution
          </Text>
          
          <View className="items-center mb-4">
            <PieChart
              data={generateChartData()}
              width={300}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
            <View className="absolute top-16 items-center">
              <Text className="text-2xl font-bold text-gray-800">
                {totalBill.toFixed(2)}
              </Text>
              <Text className="text-sm text-gray-500">LKR</Text>
            </View>
          </View>
        </View>

        {/* Usage Table */}
        <View className="bg-white rounded-xl shadow-sm mb-6">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">
              Usage Details
            </Text>
          </View>
          
          {/* Table Header */}
          <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
            <View style={{ width: "40%" }} className="justify-center"><Text className="flex-1 font-semibold text-gray-700 ">Group User</Text></View>
            <View style={{ width: "30%" }} className="justify-center"><Text className="flex-1 font-semibold text-gray-700 ">Data Usage</Text></View>
            <View style={{ width: "30%" }} className="justify-center"><Text className="flex-1 font-semibold text-gray-700 ">Bill Amount (LKR)</Text></View>
          </View>

          {/* Table Rows */}
          {billingData.members.map((member, index) => (
            <View 
              key={member.id} 
              className={`flex-row p-3 ${index !== billingData.members.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View style={{ width: "40%" }} className="justify-center"><Text className="flex-2 text-gray-800">{member.username}</Text></View>
              <View style={{ width: "30%" }} className="justify-center"><Text className="flex-1  text-gray-600">{member.dataUsage} GB</Text></View>
              <View style={{ width: "30%" }} className="justify-center"><Text className="flex-1 font-medium text-gray-800">
                {member.billAmount.toFixed(2)}
              </Text>
              </View>
            </View>
          ))}
        </View>

        {/* View My Quota Button */}
        <TouchableOpacity 
          className="bg-blue-500 py-4 rounded-lg items-center mb-6"
          onPress={navigateToMyQuota}
        >
          <Text className="text-white font-bold text-lg">View My Quota</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {/* {showDatePicker && (
        <DateTimePickerModal
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )} */}

      {/* Edit Bill Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditBillModal}
        onRequestClose={() => setShowEditBillModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-xl p-6 mx-4 w-80">
            <Text className="text-lg font-bold mb-4 text-center">
              Edit Total Bill Amount
            </Text>
            
            <Text className="text-gray-700 font-medium mb-2">Amount (LKR):</Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-base mb-6"
              placeholder="Enter total bill amount"
              value={editBillAmount}
              onChangeText={setEditBillAmount}
              keyboardType="numeric"
            />

            <View className="flex-row space-x-2">
              <TouchableOpacity 
                className="flex-1 bg-gray-300 py-3 rounded-lg items-center mr-2"
                onPress={() => setShowEditBillModal(false)}
              >
                <Text className="text-gray-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-blue-500 py-3 rounded-lg items-center ml-2"
                onPress={handleEditBill}
              >
                <Text className="text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BillingSummary;