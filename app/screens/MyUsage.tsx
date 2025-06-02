import * as React from 'react';
import { useState, useEffect } from 'react';
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

interface UsageData {
  percentage: number;
  current: number;
  limit: number;
  date: string;
  chartData: number[];
  chartLabels: string[];
}

interface MonthlyUsageData {
  totalUsage: number;
  month: string;
  chartData: number[];
  chartLabels: string[];
}

interface MyUsageProps {
  onCheckBillShare: () => void;
  group: { id: string; name: string };
}

const MyUsage = ({ onCheckBillShare, group }: MyUsageProps) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('16 Oct 2024');
  const [selectedMonth, setSelectedMonth] = useState('Oct 2024');

  // Mock data for daily usage
  const [dailyUsage, setDailyUsage] = useState<UsageData>({
    percentage: 8.21,
    current: 0.32,
    limit: 3,
    date: '16 Oct 2024',
    chartData: [0.1, 0.12, 0.08, 0.15, 0.25, 0.32, 0.28, 0.35, 0.42, 0.38, 0.45, 0.32],
    chartLabels: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
  });

  // Mock data for monthly usage
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsageData>({
    totalUsage: 45.8,
    month: 'Oct 2024',
    chartData: [2.1, 3.2, 2.8, 4.5, 3.9, 5.2, 4.8, 6.1, 5.7, 7.2, 6.8, 8.1, 7.5, 9.2, 8.8],
    chartLabels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29'],
  });

  const screenWidth = Dimensions.get('window').width;

  const availableDates = [
    '16 Oct 2024',
    '15 Oct 2024',
    '14 Oct 2024',
    '13 Oct 2024',
    '12 Oct 2024',
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
    setDailyUsage(prev => ({
      ...prev,
      date,
      percentage: Math.random() * 15 + 5,
      current: Math.random() * 2 + 0.1,
    }));
    setDateModalVisible(false);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    // Mock data update for selected month
    setMonthlyUsage(prev => ({
      ...prev,
      month,
      totalUsage: Math.random() * 50 + 20,
    }));
    setMonthModalVisible(false);
  };

  const DonutChart = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
          /> */}
          {/* Progress circle */}
          {/* <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          /> */}
        {/* </svg> */}
        <Text className="text-2xl font-bold text-gray-800 absolute">
          {percentage.toFixed(2)}%
        </Text>
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
        {activeTab === 'daily' ? (
          <View>
            {/* Date and Usage Info */}
            <TouchableOpacity
              onPress={() => setDateModalVisible(true)}
              className="mb-4"
            >
              <Text className="text-gray-600 text-sm mb-2">{dailyUsage.date}</Text>
            </TouchableOpacity>

            <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <DonutChart percentage={dailyUsage.percentage} />
                
                <View className="flex-1 ml-6">
                  <Text className="text-lg font-bold text-gray-800 mb-2">
                    Daily Limit: {dailyUsage.limit} GB
                  </Text>
                  <Text className="text-gray-600 mb-1">Current Usage</Text>
                  <Text className="text-2xl font-bold text-gray-800">
                    {dailyUsage.current.toFixed(2)} GB
                  </Text>
                </View>
              </View>
            </View>

            {/* Daily Usage Distribution Chart */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Daily Usage Distribution
              </Text>
              <LineChart
                data={{
                  labels: dailyUsage.chartLabels,
                  datasets: [
                    {
                      data: dailyUsage.chartData,
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
                  decimalPlaces: 2,
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
          </View>
        ) : (
          <View>
            {/* Month and Usage Info */}
            <TouchableOpacity
              onPress={() => setMonthModalVisible(true)}
              className="mb-4"
            >
              <Text className="text-gray-600 text-sm mb-2">{monthlyUsage.month}</Text>
            </TouchableOpacity>

            <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <DonutChart percentage={(monthlyUsage.totalUsage / 100) * 100} />
                
                <View className="flex-1 ml-6">
                  <Text className="text-lg font-bold text-gray-800 mb-2">
                    Monthly Usage
                  </Text>
                  <Text className="text-2xl font-bold text-gray-800">
                    {monthlyUsage.totalUsage.toFixed(2)} GB
                  </Text>
                </View>
              </View>
            </View>

            {/* Monthly Usage Chart */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Usage Distribution
              </Text>
              <LineChart
                data={{
                  labels: monthlyUsage.chartLabels,
                  datasets: [
                    {
                      data: monthlyUsage.chartData,
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
                  decimalPlaces: 1,
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
          </View>
        )}

        {/* Check My Bill Share Button */}
        <TouchableOpacity
          onPress={onCheckBillShare}
          className="bg-blue-500 py-4 rounded-lg mb-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Check My Bill Share
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

export default MyUsage;