import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  type: 'warning' | 'info';
  title: string;
  message: string;
  fullMessage: string;
  date: string;
  isRead: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock notification data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Daily Usage Limit Exceeded!',
      message: 'Earn points from without making a purchase complete your first mission today',
      fullMessage: 'Your daily usage limit has been exceeded. To continue using the app without restrictions, you can earn points by completing your first mission today or make a purchase to unlock unlimited access.',
      date: '16 Oct',
      isRead: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Daily Usage Limit Exceeded!',
      message: 'Earn points from without making a purchase complete your first mission today',
      fullMessage: 'Your daily usage limit has been exceeded. To continue using the app without restrictions, you can earn points by completing your first mission today or make a purchase to unlock unlimited access.',
      date: '16 Oct',
      isRead: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Daily Usage Limit Exceeded!',
      message: 'Earn points from without making a purchase complete your first mission today',
      fullMessage: 'Your daily usage limit has been exceeded. To continue using the app without restrictions, you can earn points by completing your first mission today or make a purchase to unlock unlimited access.',
      date: '16 Oct',
      isRead: false,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Daily Usage Limit Exceeded!',
      message: 'Earn points from without making a purchase complete your first mission today',
      fullMessage: 'Your daily usage limit has been exceeded. To continue using the app without restrictions, you can earn points by completing your first mission today or make a purchase to unlock unlimited access.',
      date: '16 Oct',
      isRead: false,
    },
    {
      id: '5',
      type: 'warning',
      title: 'Daily Usage Limit Exceeded!',
      message: 'Earn points from without making a purchase complete your first mission today',
      fullMessage: 'Your daily usage limit has been exceeded. To continue using the app without restrictions, you can earn points by completing your first mission today or make a purchase to unlock unlimited access.',
      date: '16 Oct',
      isRead: false,
    },
    {
      id: '6',
      type: 'warning',
      title: 'Daily Usage Limit Exceeded!',
      message: 'Earn points from without making a purchase complete your first mission today',
      fullMessage: 'Your daily usage limit has been exceeded. To continue using the app without restrictions, you can earn points by completing your first mission today or make a purchase to unlock unlimited access.',
      date: '16 Oct',
      isRead: false,
    },
    {
      id: '7',
      type: 'info',
      title: 'You have been added to a new Group',
      message: 'Earn points from without making a purchase complete your first mission today',
      fullMessage: 'Congratulations! You have been successfully added to a new group. You can now participate in group activities, earn points through group missions, and collaborate with other members to unlock exclusive rewards.',
      date: '16 Oct',
      isRead: false,
    },
  ];

  // Simulate API call
  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulate API delay
      setTimeout(() => {
        setNotifications(mockNotifications);
      }, 500);
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return 'bg-gray-300';
    }
    switch (type) {
      case 'warning':
        return 'bg-orange-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-blue-500';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    
    // Mark as read
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notification.id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNotification(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <View className="bg-blue-500 py-4 px-4">
        <Text className="text-white text-xl font-bold text-center">
          Notifications
        </Text>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 px-4 py-2">
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => handleNotificationPress(notification)}
            className="mb-3"
          >
            <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <View className="flex-row items-start">
                {/* Icon */}
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${getNotificationColor(notification.type, notification.isRead)}`}>
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={24}
                    color="white"
                  />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className={`font-semibold text-base ${notification.isRead ? 'text-gray-500' : 'text-gray-800'}`}>
                      {notification.title}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {notification.date}
                    </Text>
                  </View>
                  <Text className={`text-sm leading-5 ${notification.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
                    {notification.message}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for full notification */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <View className="flex-row items-center mb-4">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${getNotificationColor(selectedNotification?.type || 'info', false)}`}>
                <Ionicons
                  name={getNotificationIcon(selectedNotification?.type || 'info')}
                  size={20}
                  color="white"
                />
              </View>
              <Text className="font-bold text-lg flex-1">
                {selectedNotification?.title}
              </Text>
            </View>
            
            <Text className="text-gray-700 text-base leading-6 mb-6">
              {selectedNotification?.fullMessage}
            </Text>
            
            <TouchableOpacity
              onPress={closeModal}
              className="bg-blue-500 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Notifications;