import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, Platform } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle } from "react-native-svg"; 
import React = require("react");
import CalendarModal from "../../components/CalendarModal"

const DonutChart = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ justifyContent: "center", alignItems: "center", width: size, height: size }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", position: "absolute" }}>
        {percentage.toFixed(2)}%
      </Text>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
    </View>
  );
};

const formatDateForDisplay = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatDateForFetch = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

interface MyUsageProps {
  onCheckBillShare: () => void;
  group?: any; 
}

const MyUsage = ({ onCheckBillShare, group }: MyUsageProps) => {
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyUsage, setDailyUsage] = useState<any>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerValue, setPickerValue] = useState(new Date());
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchDailyUsageData(formatDateForFetch(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const monthYear = selectedDate.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
    fetchMonthlyUsageData(monthYear);
  }, [selectedDate]);


  const fetchDailyUsageData = (date: string) => {
    setTimeout(() => {
      const mockData = {
        percentage: Math.random() * 15 + 5,
        current: Math.random() * 2 + 0.1,
        limit: 3,
        chartData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 20)),
        chartLabels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
      };
      setDailyUsage(mockData);
    }, 500);
  };

  const fetchMonthlyUsageData = (month: string) => {
    setTimeout(() => {
      const mockData = {
        totalUsage: Math.random() * 300 + 150,
        chartData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 20)),
        chartLabels: ["1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23"],
      };
      setMonthlyUsage(mockData);
    }, 500);
  };

  return (
    <View className="flex-1">
      <View className="bg-white px-4">
        <View className="flex-row">
          {['daily', 'monthly'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 border-b-2 ${
                activeTab === tab ? "border-blue-500 bg-gray-100" : "border-transparent"
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === tab ? "text-blue-500" : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {activeTab === "daily" && dailyUsage && (
          <View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="mb-4">
              <Text className="text-gray-600 text-sm mb-2">{formatDateForDisplay(selectedDate)}</Text>
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

            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Daily Usage Distribution
              </Text>
              <LineChart
                data={{
                  labels: dailyUsage.chartLabels,
                  datasets: [{ data: dailyUsage.chartData }],
                }}
                width={screenWidth - 56}
                height={200}
                yAxisSuffix="GB"
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                  propsForDots: { r: "4", strokeWidth: "2", stroke: "#3B82F6" },
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          </View>
        )}

        {activeTab === "monthly" && monthlyUsage && (
          <View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="mb-4">
              <Text className="text-gray-600 text-sm mb-2">{formatDateForDisplay(selectedDate)}</Text>
            </TouchableOpacity>
            <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Monthly Usage: {monthlyUsage.totalUsage.toFixed(2)} GB
              </Text>
            </View>

            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Usage Distribution
              </Text>
              <LineChart
                data={{
                  labels: monthlyUsage.chartLabels,
                  datasets: [{ data: monthlyUsage.chartData }],
                }}
                width={screenWidth - 56}
                height={200}
                yAxisSuffix="GB"
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                  propsForDots: { r: "4", strokeWidth: "2", stroke: "#3B82F6" },
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          </View>
        )}

        <TouchableOpacity onPress={onCheckBillShare} className="bg-blue-500 py-4 rounded-lg mb-6">
          <Text className="text-white text-center font-semibold text-lg">
            Check My Bill Share
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <Modal animationType="slide" transparent visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <CalendarModal
                visible={showDatePicker}
                initialDate={pickerValue.toISOString().split("T")[0]}
                onClose={() => setShowDatePicker(false)}
                onSelect={(date: Date) => {
                  setPickerValue(date);
                  setSelectedDate(date);
                }}
              />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MyUsage;