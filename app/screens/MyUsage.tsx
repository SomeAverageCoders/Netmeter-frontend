// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, Platform } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LineChart } from "react-native-chart-kit";
// import Svg, { Circle } from "react-native-svg"; 
// import Dates from "@/components/Dates";
// import CustomDatePicker from "@/components/CustomDatePicker";


// // Donut chart component using react-native-svg
// const DonutChart = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
//   const strokeWidth = 12;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = radius * 2 * Math.PI;
//   const strokeDasharray = circumference;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <View style={{ justifyContent: "center", alignItems: "center", width: size, height: size }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold", position: "absolute" }}>
//         {percentage.toFixed(2)}%
//       </Text>
//       <Svg width={size} height={size}>
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="#E0E0E0"
//           strokeWidth={strokeWidth}
//           fill="none"
//         />
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="#3B82F6"
//           strokeWidth={strokeWidth}
//           fill="none"
//           strokeDasharray={strokeDasharray}
//           strokeDashoffset={strokeDashoffset}
//         />
//       </Svg>
//     </View>
//   );
// };

// const MyUsage = ({ onCheckBillShare }: { onCheckBillShare: () => void }) => {
//   const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
//   const [selectedDate, setSelectedDate] = useState("16 Oct 2024");
//   const [dailyUsage, setDailyUsage] = useState<any>(null);
//   const [monthlyUsage, setMonthlyUsage] = useState<any>(null); // Monthly usage state
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [pickerValue, setPickerValue] = useState(new Date());
//   const screenWidth = Dimensions.get("window").width;

//   useEffect(() => {
//     // Initialize data when the component mounts
//     fetchDailyUsageData(selectedDate);
//     fetchMonthlyUsageData("Oct 2024"); // Initialize monthly data
//   }, []);

//   const fetchDailyUsageData = (date: string) => {
//     // Mock data fetching logic
//     setTimeout(() => {
//       const mockData = {
//         percentage: Math.random() * 15 + 5,
//         current: Math.random() * 2 + 0.1,
//         limit: 3,
//         chartData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 20)),
//         chartLabels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
//       };
//       setDailyUsage(mockData);
//     }, 500);
//   };

//   const fetchMonthlyUsageData = (month: string) => {
//     // Mock data fetching logic for monthly usage
//     setTimeout(() => {
//       const mockData = {
//         totalUsage: Math.random() * 300 + 150,
//         chartData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 20)),
//         chartLabels: ["1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23"],
//       };
//       setMonthlyUsage(mockData);
//     }, 500);
//   };

//   const handleDateChange = (event: any, selectedDate: Date | undefined) => {
//     if (event.type === "set" && selectedDate) {
//       setPickerValue(selectedDate);
//       const formattedDate = selectedDate.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "2-digit",
//       });
//       setSelectedDate(formattedDate);
//       fetchDailyUsageData(formattedDate); // Update the data based on selected date
//     }
//     setShowDatePicker(false); // Close the date picker modal after selection
//   };

//   return (
//     <View className="flex-1">
//       {/* Header Navigation */}
//       {/* <View className="bg-white px-4 py-3 shadow-md">
//         <View className="flex-row justify-between items-center">
//           <Text className="text-xl font-semibold text-gray-800">My Usage</Text>
//           <TouchableOpacity onPress={onCheckBillShare} className="flex-row items-center">
//             <Ionicons name="information-circle" size={24} color="#3B82F6" />
//             <Text className="ml-2 text-blue-500">Check Bill Share</Text>
//           </TouchableOpacity>
//         </View>
//       </View> */}

//       {/* Daily/Monthly Tabs */}
//       <View className="bg-white px-4">
//         <View className="flex-row">
//           <TouchableOpacity
//             onPress={() => setActiveTab("daily")}
//             className={`flex-1 py-3 border-b-2 ${
//               activeTab === "daily" ? "border-blue-500 bg-gray-100" : "border-transparent"
//             }`}
//           >
//             <Text
//               className={`text-center font-medium ${
//                 activeTab === "daily" ? "text-blue-500" : "text-gray-600"
//               }`}
//             >
//               Daily
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setActiveTab("monthly")}
//             className={`flex-1 py-3 border-b-2 ${
//               activeTab === "monthly" ? "border-blue-500 bg-gray-100" : "border-transparent"
//             }`}
//           >
//             <Text
//               className={`text-center font-medium ${
//                 activeTab === "monthly" ? "text-blue-500" : "text-gray-600"
//               }`}
//             >
//               Monthly
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView className="flex-1 px-4 py-4">
//         {/* Daily Usage Section */}
//         {activeTab === "daily" && dailyUsage && (
//           <View>
//             {/* Date Picker */}
//             <TouchableOpacity
//               onPress={() => setShowDatePicker(true)}
//               className="mb-4"
//             >
//               <Text className="text-gray-600 text-sm mb-2">{selectedDate}</Text>
//             </TouchableOpacity>

//             <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
//               <View className="flex-row items-center justify-between">
//                 {/* Donut Chart */}
//                 <DonutChart percentage={dailyUsage.percentage} />

//                 <View className="flex-1 ml-6">
//                   <Text className="text-lg font-bold text-gray-800 mb-2">
//                     Daily Limit: {dailyUsage.limit} GB
//                   </Text>
//                   <Text className="text-gray-600 mb-1">Current Usage</Text>
//                   <Text className="text-2xl font-bold text-gray-800">
//                     {dailyUsage.current.toFixed(2)} GB
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Daily Usage Distribution Chart */}
//             <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
//               <Text className="text-lg font-semibold text-gray-800 mb-4">
//                 Daily Usage Distribution
//               </Text>
//               <LineChart
//                 data={{
//                   labels: dailyUsage.chartLabels,
//                   datasets: [
//                     {
//                       data: dailyUsage.chartData,
//                     },
//                   ],
//                 }}
//                 width={Dimensions.get("window").width - 56}
//                 height={200}
//                 yAxisSuffix="GB"
//                 chartConfig={{
//                   backgroundColor: "#ffffff",
//                   backgroundGradientFrom: "#ffffff",
//                   backgroundGradientTo: "#ffffff",
//                   decimalPlaces: 2,
//                   color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
//                   labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
//                   style: {
//                     borderRadius: 16,
//                   },
//                   propsForDots: {
//                     r: "4",
//                     strokeWidth: "2",
//                     stroke: "#3B82F6",
//                   },
//                 }}
//                 bezier
//                 style={{
//                   marginVertical: 8,
//                   borderRadius: 16,
//                 }}
//               />
//             </View>
//           </View>
//         )}

//         {/* Monthly Usage Section */}
//         {activeTab === "monthly" && monthlyUsage && (
//           <View>
//             <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
//               <Text className="text-lg font-bold text-gray-800 mb-2">
//                 Monthly Usage: {monthlyUsage.totalUsage.toFixed(2)} GB
//               </Text>
//             </View>

//             <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
//               <Text className="text-lg font-semibold text-gray-800 mb-4">
//                 Monthly Usage Distribution
//               </Text>
//               <LineChart
//                 data={{
//                   labels: monthlyUsage.chartLabels,
//                   datasets: [
//                     {
//                       data: monthlyUsage.chartData,
//                     },
//                   ],
//                 }}
//                 width={Dimensions.get("window").width - 56}
//                 height={200}
//                 yAxisSuffix="GB"
//                 chartConfig={{
//                   backgroundColor: "#ffffff",
//                   backgroundGradientFrom: "#ffffff",
//                   backgroundGradientTo: "#ffffff",
//                   decimalPlaces: 2,
//                   color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
//                   labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
//                   style: {
//                     borderRadius: 16,
//                   },
//                   propsForDots: {
//                     r: "4",
//                     strokeWidth: "2",
//                     stroke: "#3B82F6",
//                   },
//                 }}
//                 bezier
//                 style={{
//                   marginVertical: 8,
//                   borderRadius: 16,
//                 }}
//               />
//             </View>
//           </View>
//         )}

//         {/* Check My Bill Share Button */}
//         <TouchableOpacity
//           onPress={onCheckBillShare}
//           className="bg-blue-500 py-4 rounded-lg mb-6"
//         >
//           <Text className="text-white text-center font-semibold text-lg">
//             Check My Bill Share
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Date Selection Modal */}
// {showDatePicker && (
//   <Modal
//     animationType="slide"
//     transparent={true}
//     visible={showDatePicker}
//     onRequestClose={() => setShowDatePicker(false)}
//   >
//     <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
//       <View className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
//         <Text className="text-lg font-bold mb-4">Select Date</Text>

//         {/* Native Date Picker (iOS/Android) */}
//         {Platform.OS === "android" ? (
//           <CustomDatePicker
//             visible={showDatePicker}
//             initialDate={pickerValue}
//             onClose={() => setShowDatePicker(false)}
//             onSelect={(selectedDate: Date) => {
//               setPickerValue(selectedDate);
//               const formattedDate = selectedDate.toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "2-digit",
//               });
//               setSelectedDate(formattedDate);
//               fetchDailyUsageData(formattedDate); // ← This must run correctly
//             }}
//           />


//         ) : (
//           <CustomDatePicker
//             visible={showDatePicker}
//             initialDate={pickerValue}
//             onClose={() => setShowDatePicker(false)}
//             onSelect={(selectedDate: Date) => {
//               setPickerValue(selectedDate);
//               const formattedDate = selectedDate.toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "2-digit",
//               });
//               setSelectedDate(formattedDate);
//               fetchDailyUsageData(formattedDate); // ← This must run correctly
//             }}
//           />


//         )}

//         <TouchableOpacity
//           onPress={() => setShowDatePicker(false)}
//           className="bg-blue-500 py-3 rounded-lg mt-4"
//         >
//           <Text className="text-white text-center font-semibold">Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </Modal>
// )}

//     </View>
//   );
// };

// export default MyUsage;


import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle } from "react-native-svg"; 
import Dates from "@/components/Dates";
import CustomDatePicker from "@/components/CustomDatePicker";

// Donut chart component using react-native-svg
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

const MyUsage = ({ onCheckBillShare }: { onCheckBillShare: () => void }) => {
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2024-10-16"));
  const [dailyUsage, setDailyUsage] = useState<any>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerValue, setPickerValue] = useState(new Date());
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchDailyUsageData(formatDateForFetch(selectedDate));
    fetchMonthlyUsageData("Oct 2024");
  }, []);

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

  const handleDateChange = (event: any, selected: Date | undefined) => {
    if (event.type === "set" && selected) {
      setPickerValue(selected);
      setSelectedDate(selected);
      fetchDailyUsageData(formatDateForFetch(selected));
    }
    setShowDatePicker(false);
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
            <View className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
              <Text className="text-lg font-bold mb-4">Select Date</Text>
              <CustomDatePicker
                visible={showDatePicker}
                initialDate={pickerValue}
                onClose={() => setShowDatePicker(false)}
                onSelect={(date: Date) => {
                  setPickerValue(date);
                  setSelectedDate(date);
                  fetchDailyUsageData(formatDateForFetch(date));
                }}
              />
              <TouchableOpacity onPress={() => setShowDatePicker(false)} className="bg-blue-500 py-3 rounded-lg mt-4">
                <Text className="text-white text-center font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MyUsage;
