import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, TextInput, TouchableOpacity, SafeAreaView, Switch, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';

const WifiConfigScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const groupId = (route.params && (route.params as any).id) ? (route.params as any).id : undefined;

  // State for form fields
  const [networkName, setNetworkName] = useState('');
  const [ssid, setSsid] = useState('');
  const [dataQuota, setDataQuota] = useState('');
  const [dailyUsageLimitPerMember, setDailyUsageLimitPerMember] = useState('');
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    axios
      .get(`http://localhost:3000/wifi/${groupId}`)
      .then(res => {
        const data = res.data;
        if (data) {
          setNetworkName(data.networkName || '');
          setSsid(data.ssid || '');
          setDataQuota(data.dataQuota || '');
          setDailyUsageLimitPerMember(data.dailyUsageLimitPerMember || '');
          setStatus(!!data.status);
        } else {
          setNetworkName('');
          setSsid('');
          setDataQuota('');
          setDailyUsageLimitPerMember('');
          setStatus(false);
        }
      })
      .catch(() => {
        setNetworkName('');
        setSsid('');
        setDataQuota('');
        setDailyUsageLimitPerMember('');
        setStatus(false);
      })
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleSaveConfig = async () => {
    

    if (networkName.trim() === '' || ssid.trim() === '' || dataQuota.trim() === '' || dailyUsageLimitPerMember.trim() === '') {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    try {
      await axios.post(`http://localhost:3000/wifi/${groupId}`, {
        networkName,
        ssid,
        dataQuota,
        status,
        dailyUsageLimitPerMember,
      }).then(() => {
          console.log('Wi-Fi configuration saved successfully!');
          router.replace(`/screens/Groups/${groupId}`);

      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save Wi-Fi configuration');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      {/* Header */}
      <View className="bg-blue-500 p-4">
        <View className="justify-center items-center relative">
          <TouchableOpacity
            className="absolute left-0"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold text-center">
            Wi-Fi Configuration
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center p-4">
        {/* Wi-Fi Settings Form */}
        {errorMsg ? (
          <Text className="text-red-500 text-lg font-bold">{errorMsg}</Text>
        ) : null}
        <View className="mx-4 mt-2 bg-gray-100 rounded-xl p-4 relative w-full">
          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <View className="mb-4">
              <Text className="text-gray-700 text-lg mb-2 font-semibold">Network Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
                placeholder="e.g. MyWiFi"
                placeholderTextColor={'#9CA3AF'}
                value={networkName}
                onChangeText={setNetworkName}
                editable={true}
              />
            </View>
            <View className="mb-4">
              <Text className="text-gray-700 text-lg mb-2 font-semibold">SSID</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
                placeholder="e.g. MyWiFiNetwork"
                placeholderTextColor={'#9CA3AF'}
                value={ssid}
                onChangeText={setSsid}
                editable={true}
              />
            </View>
            <View className="mb-4">
              <Text className="text-gray-700 text-lg mb-2 font-semibold">Data Quota</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
                placeholder="e.g. 100GB"
                placeholderTextColor={'#9CA3AF'}
                value={dataQuota}
                onChangeText={setDataQuota}
                editable={true}
              />
            </View>
            <View className="mb-4">
              <Text className="text-gray-700 text-lg mb-2 font-semibold">Daily Usage Limit Per Member</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
                placeholder="e.g. 3GB"
                placeholderTextColor={'#9CA3AF'}
                value={dailyUsageLimitPerMember}
                onChangeText={setDailyUsageLimitPerMember}
                editable={true}
              />
            </View>
            <View className="mb-4 flex-row justify-between items-center">
              <Text className="text-gray-700 text-lg font-semibold">Active</Text>
              <Switch
                value={status}
                onValueChange={setStatus}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={status ? '#3b82f6' : '#f4f4f5'}
              />
            </View>
          </View>
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-lg items-center mt-4"
            onPress={handleSaveConfig}
          >
            <Text className="text-white text-lg font-bold">Save Configuration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WifiConfigScreen;