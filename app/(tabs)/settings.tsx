import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Switch,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
}

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<string>('');
  const [adminModeEnabled, setAdminModeEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
  });

  const settingsItems: SettingItem[] = [
    {
      id: 'group-policies',
      title: 'Set Group Policies',
      icon: 'people-circle-outline',
    },
    {
      id: 'admin-mode',
      title: 'Switch to Admin mode',
      icon: 'shield-outline',
      hasToggle: true,
      toggleValue: adminModeEnabled,
    },
    {
      id: 'app-language',
      title: 'App Language',
      icon: 'globe-outline',
    },
    {
      id: 'notification-settings',
      title: 'Notification Settings',
      icon: 'notifications-outline',
    },
    {
      id: 'help-support',
      title: 'Help & Support',
      icon: 'help-circle-outline',
    },
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
  ];

  const handleSettingPress = (settingId: string) => {
    if (settingId === 'admin-mode') {
      setAdminModeEnabled(!adminModeEnabled);
      return;
    }
    setSelectedSetting(settingId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSetting('');
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    closeModal();
  };

  const handleNotificationToggle = (type: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  const renderModalContent = () => {
    switch (selectedSetting) {
      case 'group-policies':
        return (
          <View>
            <Text className="text-lg font-bold mb-4">Group Policies</Text>
            <View className="space-y-4">
              <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
                <Text className="font-semibold">Member Permissions</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Configure what group members can do
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
                <Text className="font-semibold">Content Moderation</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Set rules for group content
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
                <Text className="font-semibold">Privacy Settings</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Control group visibility and access
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'app-language':
        return (
          <View>
            <Text className="text-lg font-bold mb-4">Select Language</Text>
            <ScrollView className="max-h-64">
              {languages.map((language) => (
                <TouchableOpacity
                  key={language}
                  onPress={() => handleLanguageSelect(language)}
                  className={`p-4 border-b border-gray-200 flex-row justify-between items-center ${
                    selectedLanguage === language ? 'bg-blue-50' : ''
                  }`}
                >
                  <Text className={`text-base ${
                    selectedLanguage === language ? 'text-blue-600 font-semibold' : 'text-gray-800'
                  }`}>
                    {language}
                  </Text>
                  {selectedLanguage === language && (
                    <Ionicons name="checkmark" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 'notification-settings':
        return (
          <View>
            <Text className="text-lg font-bold mb-4">Notification Settings</Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center py-3">
                <View>
                  <Text className="font-semibold">Push Notifications</Text>
                  <Text className="text-gray-600 text-sm">
                    Receive notifications on your device
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.pushNotifications}
                  onValueChange={() => handleNotificationToggle('pushNotifications')}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={notificationSettings.pushNotifications ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              
              <View className="flex-row justify-between items-center py-3">
                <View>
                  <Text className="font-semibold">Email Notifications</Text>
                  <Text className="text-gray-600 text-sm">
                    Receive notifications via email
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.emailNotifications}
                  onValueChange={() => handleNotificationToggle('emailNotifications')}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={notificationSettings.emailNotifications ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              
              <View className="flex-row justify-between items-center py-3">
                <View>
                  <Text className="font-semibold">SMS Notifications</Text>
                  <Text className="text-gray-600 text-sm">
                    Receive notifications via SMS
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.smsNotifications}
                  onValueChange={() => handleNotificationToggle('smsNotifications')}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={notificationSettings.smsNotifications ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
          </View>
        );

      case 'help-support':
        return (
          <View>
            <Text className="text-lg font-bold mb-4">Help & Support</Text>
            <View className="space-y-4">
              <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
                <Text className="font-semibold">FAQ</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Frequently asked questions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
                <Text className="font-semibold">Contact Support</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Get help from our support team
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
                <Text className="font-semibold">Report a Bug</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Let us know about any issues
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
                <Text className="font-semibold">Terms of Service</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Read our terms and conditions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <View className="bg-blue-500 py-4 px-4">
        <Text className="text-white text-xl font-bold text-center">
          Settings
        </Text>
      </View>

      {/* Settings List */}
      <ScrollView className="flex-1 px-4 py-6">
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleSettingPress(item.id)}
            className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                {/* Icon */}
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color="#6B7280"
                  />
                </View>
                
                {/* Title */}
                <Text className="text-gray-800 font-medium text-base flex-1">
                  {item.title}
                </Text>
              </View>

              {/* Toggle or Arrow */}
              {item.hasToggle ? (
                <Switch
                  value={item.toggleValue}
                  onValueChange={() => handleSettingPress(item.id)}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={item.toggleValue ? '#FFFFFF' : '#F3F4F6'}
                />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"  
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 mx-4 max-w-md w-full max-h-96">
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderModalContent()}
            </ScrollView>
            
            <TouchableOpacity
              onPress={closeModal}
              className="bg-blue-500 py-3 rounded-lg mt-6"
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

export default Settings;