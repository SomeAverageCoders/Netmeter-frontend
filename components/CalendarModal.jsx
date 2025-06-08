import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarModal({ visible, initialDate, onClose, onSelect }) {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setSelectedDate(initialDate || new Date().toISOString().split('T')[0]);
  }, [initialDate]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const confirmDate = () => {
    if (onSelect) onSelect(new Date(selectedDate));
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: 'blue',
              },
            }}
            current={selectedDate}
          />
          <Pressable style={styles.okButton} onPress={confirmDate}>
            <Text style={styles.okText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  okButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  okText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
