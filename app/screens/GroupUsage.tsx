import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import DonutChart from "../../components/DonutChart";
import CalendarModal from "../../components/CalendarModal";

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
  group?: any; 
}

const GroupUsage = ({ onCheckBillSummary, group }: GroupUsageProps) => {
  // console.log("GroupUsage component rendered with group: ", group);
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState("Oct 2024");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCustomMonthPicker, setShowCustomMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const [groupUsage, setGroupUsage] = useState<GroupUsageData | null>(null);
  const screenWidth = Dimensions.get("window").width;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });


  const fetchGroupUsage = async (type: "daily" | "monthly", value: string): Promise<GroupUsageData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalUsage = type === "daily" ? Math.random() * 100 + 50 : Math.random() * 300 + 150;
        const randomValue = () => +(Math.random() * 40 + 10).toFixed(2);

        const members: GroupMember[] = [
          { id: "1", name: "Rehan_123 (You)", usage: randomValue(), color: "#60A5FA", percentage: 0 },
          { id: "2", name: "Kevin_4J", usage: randomValue(), color: "#93C5FD", percentage: 0 },
          { id: "3", name: "Nikil_Fer", usage: randomValue(), color: "#1E40AF", percentage: 0 },
          { id: "4", name: "Peter_parker", usage: randomValue(), color: "#BFDBFE", percentage: 0 },
          { id: "5", name: "Jihan", usage: randomValue(), color: "#DBEAFE", percentage: 0 },
        ];

        const totalUsed = members.reduce((sum, m) => sum + m.usage, 0);
        const normalized = members.map((m) => ({
          ...m,
          percentage: +(m.usage / totalUsed * 100).toFixed(2),
        }));

        const chartData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 20));
        const chartLabels = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];

        resolve({
          totalUsage: +totalUsage.toFixed(2),
          date: type === "daily" ? value : "",
          month: type === "monthly" ? value : "",
          members: normalized,
          chartData,
          chartLabels,
        });
      }, 500);
    });
  };

  useEffect(() => {
    const today = new Date();
    fetchGroupUsage("daily", formatDate(today)).then(setGroupUsage);
  }, []);

  const handleMonthSelect = (month: string) => {
    const formatted = `${month} ${selectedYear}`;
    setSelectedMonth(formatted);
    fetchGroupUsage("monthly", formatted).then(setGroupUsage);
    setShowCustomMonthPicker(false);
  };

  if (!groupUsage) return <Text className="text-center mt-10 text-gray-600">Loading...</Text>;
    return (
    <View className="flex-1 bg-white">
      <View className="bg-white px-4">
        <View className="flex-row">
          <TouchableOpacity onPress={() => setActiveTab("daily")} className={`flex-1 py-3 border-b-2 ${activeTab === "daily" ? "border-blue-500 bg-gray-100" : "border-transparent"}`}>
            <Text className={`text-center font-medium ${activeTab === "daily" ? "text-blue-500" : "text-gray-600"}`}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("monthly")} className={`flex-1 py-3 border-b-2 ${activeTab === "monthly" ? "border-blue-500 bg-gray-100" : "border-transparent"}`}>
            <Text className={`text-center font-medium ${activeTab === "monthly" ? "text-blue-500" : "text-gray-600"}`}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <View className="mb-4">
          <Text className="text-gray-600 text-sm mb-2 font-medium">
            {activeTab === "daily" ? "Select Date" : "Select Month"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              activeTab === "daily" ? setShowDatePicker(true) : setShowCustomMonthPicker(true);
            }}
            className="bg-white border border-gray-300 px-4 py-3 rounded-md"
          >
            <Text className="text-gray-800 text-base">
              {activeTab === "daily" ? formatDate(selectedDate) : selectedMonth}
            </Text>
          </TouchableOpacity>
          
          <CalendarModal
            visible={showDatePicker}
            initialDate={selectedDate.toISOString().split('T')[0]}
            onClose={() => setShowDatePicker(false)}
            onSelect={(date: Date) => {
              setSelectedDate(date);
              fetchGroupUsage("daily", formatDate(date)).then(setGroupUsage);
            }}
          />

          {showCustomMonthPicker && (
            <Modal transparent animationType="fade">
              <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
                <View className="bg-white rounded-lg p-5 w-80">
                  <Text className="text-lg font-bold mb-4">Select Month & Year</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {months.map((month) => (
                      <TouchableOpacity key={month} onPress={() => handleMonthSelect(month)} className="px-3 py-2 mr-2 bg-gray-100 rounded-md">
                        <Text>{month}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        onPress={() => setSelectedYear(year)}
                        className={`px-4 py-2 mr-2 ${year === selectedYear ? "bg-blue-500" : "bg-gray-100"} rounded-md`}
                      >
                        <Text className={year === selectedYear ? "text-white" : "text-black"}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setShowCustomMonthPicker(false)} className="mt-4 bg-blue-500 py-3 rounded-md">
                    <Text className="text-white text-center font-semibold">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>

        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm justify-center items-center">
          <DonutChart
            data={groupUsage.members.map((m) => m.usage)}
            colors={groupUsage.members.map((m) => m.color)}
            labels={groupUsage.members.map((m) => m.name)}
            totalCapacity={groupUsage.totalUsage}
          />
        </View>

        {activeTab === "monthly" && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Monthly Usage Trend</Text>
            <LineChart
              data={{
                labels: groupUsage.chartLabels,
                datasets: [{ data: groupUsage.chartData }],
              }}
              width={screenWidth - 56}
              height={200}
              yAxisSuffix="GB"
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#3B82F6" },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        )}

        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Member & Quota</Text>
          {groupUsage.members.map((member) => (
            <View key={member.id} className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: member.color }}>
                  <Ionicons name="person" size={20} color="white" />
                </View>
                <Text className="font-medium text-gray-800 flex-1">{member.name}</Text>
              </View>
              <Text className="font-semibold text-gray-800">{member.percentage.toFixed(2)}%</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={onCheckBillSummary} className="bg-blue-500 py-4 rounded-lg mb-6">
          <Text className="text-white text-center font-semibold text-lg">Check Bill Summary</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default GroupUsage;
