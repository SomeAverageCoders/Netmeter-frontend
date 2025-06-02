import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

interface GroupMember {
  id: string;
  name: string;
  percentage: number;
  usage: number;
  color: string;
}

interface GroupUsageData {
  totalUsage: number;
  date: string;
  month: string;
  members: GroupMember[];
  chartData: number[];
  chartLabels: string[];
}

interface GroupUsageProps {
  onCheckBillSummary: () => void;
  group: { id: string; name: string };
}

const GroupUsage = ({ onCheckBillSummary, group }: GroupUsageProps) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Oct 2024');
  const [selectedMonth, setSelectedMonth] = useState('Oct 2024');

  // Mock data for group usage
  const [groupUsage, setGroupUsage] = useState<GroupUsageData>({
    totalUsage: 148.26,
    date: 'Oct 2024',
    month: 'Oct 2024',
    members: [
      { id: '1', name: 'Rehan_123 (You)', percentage: 6.20, usage: 9.19, color: '#60A5FA' },
      { id: '2', name: 'Kevin_4J', percentage: 12.82, usage: 19.01, color: '#93C5FD' },
      { id: '3', name: 'Nikil_Fer', percentage: 23.78, usage: 35.25, color: '#1E40AF' },
      { id: '4', name: 'Peter_parker', percentage: 34.24, usage: 50.76, color: '#BFDBFE' },
      { id: '5', name: 'Jihan', percentage: 11.04, usage: 16.37, color: '#DBEAFE' },
    ],
    chartData: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
    chartLabels: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
  });

  const screenWidth = Dimensions.get('window').width;

  const availableDates = [
    'Oct 2024',
    'Sep 2024',
    'Aug 2024',
    'Jul 2024',
    'Jun 2024',
  ];

  const availableMonths = [
    'Oct 2024',
    'Sep 2024',
    'Aug 2024',
    'Jul 2024',
    'Jun 2024',
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Mock data update for selected date
    setGroupUsage(prev => ({
      ...prev,
      date,
      totalUsage: Math.random() * 200 + 100,
    }));
    setDateModalVisible(false);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    // Mock data update for selected month
    setGroupUsage(prev => ({
      ...prev,
      month,
      totalUsage: Math.random() * 300 + 150,
    }));
    setMonthModalVisible(false);
  };

  const DonutChart = ({ totalUsage, members, size = 140 }: { totalUsage: number; members: GroupMember[]; size?: number }) => {
    const strokeWidth = 16;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    let accumulatedPercentage = 0;

    return (
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG commented out for now - you can uncomment and use it if needed */}
        {/* <svg width={size} height={size} className="absolute"> */}
          {/* Background circle */}
          {/* <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress segments for each member */}
          {/* {members.map((member, index) => {
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (member.percentage / 100) * circumference;
            const rotationAngle = -90 + (accumulatedPercentage / 100) * 360;
            accumulatedPercentage += member.percentage;

            return (
              <circle
                key={member.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={member.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${(member.percentage / 100) * circumference} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(${rotationAngle} ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg> */} 
        <View className="absolute items-center">
          <Text className="text-2xl font-bold text-gray-800">
            {totalUsage.toFixed(2)}
          </Text>
          <Text className="text-sm text-gray-600">GB</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {/* Daily/Monthly Tabs */}
      <View className="bg-white px-4">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab('daily')}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'daily'
                ? 'border-blue-500 bg-gray-100'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'daily' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              Daily
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('monthly')}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'monthly'
                ? 'border-blue-500 bg-gray-100'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'monthly' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Date/Month Selection */}
        <TouchableOpacity
          onPress={() => activeTab === 'daily' ? setDateModalVisible(true) : setMonthModalVisible(true)}
          className="mb-4"
        >
          <Text className="text-gray-600 text-sm mb-2">
            {activeTab === 'daily' ? groupUsage.date : groupUsage.month}
          </Text>
        </TouchableOpacity>

        {/* Usage Chart */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <DonutChart 
            totalUsage={groupUsage.totalUsage} 
            members={groupUsage.members}
          />
        </View>

        {activeTab === 'monthly' && (
          /* Monthly Usage Line Chart */
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Usage Trend
            </Text>
            <LineChart
              data={{
                labels: groupUsage.chartLabels,
                datasets: [
                  {
                    data: groupUsage.chartData,
                  },
                ],
              }}
              width={screenWidth - 56}
              height={200}
              yAxisSuffix="GB"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#3B82F6',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        )}

        {/* Member & Quota Section */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Member & Quota
          </Text>
          
          {groupUsage.members.map((member) => (
            <View key={member.id} className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <View className="flex-row items-center flex-1">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: member.color }}
                >
                  <Ionicons name="person" size={20} color="white" />
                </View>
                <Text className="font-medium text-gray-800 flex-1">
                  {member.name}
                </Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {member.percentage.toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>

        {/* Check Bill Summary Button */}
        <TouchableOpacity
          onPress={onCheckBillSummary}
          className="bg-blue-500 py-4 rounded-lg mb-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Check Bill Summary
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <Text className="text-lg font-bold mb-4">Select Date</Text>
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date}
                onPress={() => handleDateSelect(date)}
                className={`p-3 border-b border-gray-200 ${
                  selectedDate === date ? 'bg-blue-50' : ''
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedDate === date ? 'text-blue-600 font-semibold' : 'text-gray-800'
                  }`}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setDateModalVisible(false)}
              className="bg-blue-500 py-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Month Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={monthModalVisible}
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <Text className="text-lg font-bold mb-4">Select Month</Text>
            {availableMonths.map((month) => (
              <TouchableOpacity
                key={month}
                onPress={() => handleMonthSelect(month)}
                className={`p-3 border-b border-gray-200 ${
                  selectedMonth === month ? 'bg-blue-50' : ''
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedMonth === month ? 'text-blue-600 font-semibold' : 'text-gray-800'
                  }`}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setMonthModalVisible(false)}
              className="bg-blue-500 py-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
  );
};

export default GroupUsage;