import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, TextInput, TouchableOpacity, SafeAreaView, Switch, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for two groups
const mockGroups = [
  {
    id: '1',
    name: 'Uni Bording',
    wifiConfig: {
      networkId: 'NET_001',
      ssid: 'UniBording_WiFi',
      bandwidth: '20MHz',
      frequency: '2.4GHz',
      isActive: true,
    },
  },
  {
    id: '2',
    name: 'New Group',
    wifiConfig: null, // No wifi config for new group
  },
];

const WifiConfigScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // Safely extract groupId from route params
  const groupId = (route.params && (route.params as any).id) ? (route.params as any).id : undefined;

  // State for form fields
  const [networkId, setNetworkId] = useState('');
  const [ssid, setSsid] = useState('');
  const [bandwidth, setBandwidth] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    // Find group by id
    const group = mockGroups.find(g => g.id === groupId);
    if (group && group.wifiConfig) {
      setNetworkId(group.wifiConfig.networkId);
      setSsid(group.wifiConfig.ssid);
      setBandwidth(group.wifiConfig.bandwidth);
      setFrequency(group.wifiConfig.frequency);
      setIsActive(group.wifiConfig.isActive);
      setHasConfig(true);
    } else {
      setNetworkId('');
      setSsid('');
      setBandwidth('');
      setFrequency('');
      setIsActive(false);
      setHasConfig(false);
    }
  }, [groupId]);

  const handleSaveConfig = () => {
    if (networkId.trim() === '') {
      Alert.alert('Error', 'Please enter a Network ID');
      return;
    }
    if (ssid.trim() === '') {
      Alert.alert('Error', 'Please enter a Wi-Fi SSID');
      return;
    }
    if (bandwidth.trim() === '') {
      Alert.alert('Error', 'Please enter bandwidth');
      return;
    }
    if (frequency.trim() === '') {
      Alert.alert('Error', 'Please enter frequency');
      return;
    }
    // In a real app, you would save this configuration
    Alert.alert(
      'Success',
      'Wi-Fi configuration saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View className="bg-blue-500 p-4 mt-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="items-center ml-4">
              <Text className="text-white text-xl font-bold text-center">
                Wi-Fi Configuration
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className='flex-1 items-center justify-center p-4'>
        {/* Wi-Fi Settings Form */}
        <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4 relative w-full">
          <View className='bg-white rounded-lg shadow-sm p-4 mb-4'>
            <View className='mb-4'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>Network ID</Text>
              <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 text-lg'
                placeholder='e.g. NET-12345'
                value={networkId}
                onChangeText={setNetworkId}
                editable={true}
              />
            </View>
            <View className='mb-4'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>SSID</Text>
              <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 text-lg'
                placeholder='e.g. MyWiFiNetwork'
                value={ssid}
                onChangeText={setSsid}
                editable={true}
              />
            </View>
            <View className='mb-4'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>Bandwidth</Text>
              <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 text-lg'
                placeholder='e.g. 20MHz'
                value={bandwidth}
                onChangeText={setBandwidth}
                editable={true}
              />
            </View>
            <View className='mb-4'>
              <Text className='text-gray-700 text-lg mb-2 font-semibold'>Frequency</Text>
              <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 text-lg'
                placeholder='e.g. 2.4GHz'
                value={frequency}
                onChangeText={setFrequency}
                editable={true}
              />
            </View>
            <View className='mb-4 flex-row justify-between items-center'>
              <Text className='text-gray-700 text-lg font-semibold'>Active</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={isActive ? '#3b82f6' : '#f4f4f5'}
              />
            </View>
          </View>
          <TouchableOpacity 
            className='bg-blue-500 py-4 rounded-lg items-center mt-4'
            onPress={handleSaveConfig}
          >
            <Text className='text-white text-lg font-bold'>Save Configuration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WifiConfigScreen;