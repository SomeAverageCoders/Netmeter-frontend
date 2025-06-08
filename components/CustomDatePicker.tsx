import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const ITEM_HEIGHT = 40;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

const formatMonth = (m: number) =>
  new Date(0, m).toLocaleString("default", { month: "long" });

const ScrollPicker = ({
  data,
  selectedIndex,
  onChange,
}: {
  data: any[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Smooth scroll to initial position
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: true,
      });
    }, 100);
  }, [selectedIndex]);

  const onScrollEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    scrollRef.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    });
    onChange(index);
  };

  return (
    <View style={{ height: ITEM_HEIGHT * 5, overflow: "hidden" }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="center"
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
      >
        <View style={{ height: ITEM_HEIGHT * 2 }} />
        {data.map((item, idx) => (
          <View
            key={idx}
            style={{
              height: ITEM_HEIGHT,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: idx === selectedIndex ? "#000" : "#999",
                fontWeight: idx === selectedIndex ? "bold" : "normal",
              }}
            >
              {item}
            </Text>
          </View>
        ))}
        <View style={{ height: ITEM_HEIGHT * 2 }} />
      </ScrollView>

      {/* Highlight Overlay */}
      <View
        style={{
          position: "absolute",
          top: ITEM_HEIGHT * 2,
          height: ITEM_HEIGHT,
          left: 0,
          right: 0,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.05)",
        }}
        pointerEvents="none"
      />
    </View>
  );
};


const CustomDatePicker = ({
  visible,
  initialDate,
  onClose,
  onSelect,
}: {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}) => {
  const initialDay = initialDate.getDate();
  const initialMonth = initialDate.getMonth();
  const initialYear = initialDate.getFullYear();

  const years = Array.from({ length: 20 }, (_, i) => 2015 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from(
    { length: getDaysInMonth(initialMonth, initialYear) },
    (_, i) => i + 1
  );

  const [dayIndex, setDayIndex] = useState(initialDay - 1);
  const [monthIndex, setMonthIndex] = useState(initialMonth);
  const [yearIndex, setYearIndex] = useState(years.indexOf(initialYear));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-6 w-[90%] max-w-md">
          <Text className="text-lg font-bold text-center mb-4">Select Date</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <ScrollPicker
              data={Array.from(
                { length: getDaysInMonth(monthIndex, years[yearIndex]) },
                (_, i) => i + 1
              )}
              selectedIndex={dayIndex}
              onChange={setDayIndex}
            />
            <ScrollPicker
              data={months.map((m) => formatMonth(m))}
              selectedIndex={monthIndex}
              onChange={setMonthIndex}
            />
            <ScrollPicker
              data={years}
              selectedIndex={yearIndex}
              onChange={setYearIndex}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              const selected = new Date(
                years[yearIndex],
                monthIndex,
                dayIndex + 1
              );
              onSelect(selected);
              onClose();
            }}
            className="bg-blue-500 py-3 rounded-lg mt-6"
          >
            <Text className="text-white text-center font-semibold">Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="mt-3 py-2">
            <Text className="text-center text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDatePicker;
