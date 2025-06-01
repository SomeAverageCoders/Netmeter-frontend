import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Mock data for groups
  const mockGroups = [
    {
      id: "group1",
      name: "Uni Bording",
      members: [
        {
          id: "1",
          username: "Rehan_123",
          devices: [
            {
              id: "d1",
              nickname: "My iPhone",
              macAddress: "00:1B:44:11:3A:B7",
            },
            {
              id: "d2",
              nickname: "Work Laptop",
              macAddress: "00:1B:44:11:3A:B8",
            },
          ],
        },
        {
          id: "2",
          username: "Kevin_4J",
          devices: [
            {
              id: "d3",
              nickname: "MacBook Pro",
              macAddress: "00:1B:44:11:3A:B9",
            },
          ],
        },
        { id: "3", username: "Nikil_Fer", devices: [] },
        {
          id: "4",
          username: "Peter_parker",
          devices: [
            { id: "d4", nickname: "iPad Air", macAddress: "00:1B:44:11:3A:C0" },
          ],
        },
        { id: "5", username: "jihan new", devices: [] },
      ],
      wifiConfig: {
        networkId: "NET_001",
        ssid: "UniBording_WiFi",
        capacityMbps: 100,
        isActive: true,
        frequency: "2.4GHz",
        securityType: "WPA2",
      },
    },
    {
      id: "group2",
      name: "New Group",
      members: [
        { id: "6", username: "sarah_90", devices: [] },
        { id: "7", username: "mike_tech", devices: [] },
      ],
      wifiConfig: null, // No wifi config for new group
    },
  ];


const ManageGroupScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const groupId = route.params?.id;
  console.log("Group ID:", groupId);

  const [groupData, setGroupData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deviceNickname, setDeviceNickname] = useState("");
  const [deviceMacAddress, setDeviceMacAddress] = useState("");
  const [wifiConfigModalVisible, setWifiConfigModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchError, setSearchError] = useState("");

  
  useEffect(() => {
    // Simulate API call to fetch group data
    const fetchGroupData = () => {
      const group = mockGroups.find((g) => g.id === groupId) || mockGroups[0];
      setGroupData(group);
    };

    fetchGroupData();
  }, [groupId]);

  const openAddDeviceModal = (member) => {
    setSelectedMember(member);
    setDeviceNickname("");
    setDeviceMacAddress("");
    setModalVisible(true);
  };

  const handleAddDevice = () => {
    if (
      deviceNickname.trim() === "" ||
      deviceMacAddress.trim() === "" ||
      !selectedMember
    ) {
      Alert.alert("Error", "Please enter both device nickname and MAC address");
      return;
    }

    // Basic MAC address validation
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(deviceMacAddress.trim())) {
      Alert.alert(
        "Error",
        "Please enter a valid MAC address (e.g., 00:1B:44:11:3A:B7)"
      );
      return;
    }

    const newDevice = {
      id: `d${Date.now()}`,
      nickname: deviceNickname.trim(),
      macAddress: deviceMacAddress.trim().toUpperCase(),
    };

    const updatedMembers = groupData.members.map((member) => {
      if (member.id === selectedMember.id) {
        return {
          ...member,
          devices: [...(member.devices || []), newDevice],
        };
      }
      return member;
    });

    setGroupData({
      ...groupData,
      members: updatedMembers,
    });

    setModalVisible(false);
    setDeviceNickname("");
    setDeviceMacAddress("");
  };

  const handleAddUser = () => {
    navigation.navigate("SearchUser", {
      groupId: groupId,
      onUserAdded: (newUser) => {
        const updatedMembers = [
          ...groupData.members,
          { ...newUser, devices: [] },
        ];
        setGroupData({
          ...groupData,
          members: updatedMembers,
        });
      },
    });
  };

  const renderDevicesCell = (devices) => {
    if (!devices || devices.length === 0) {
      return (
        <Text className="text-gray-500 italic text-sm">
          No devices. Add a device
        </Text>
      );
    }

    return (
      <View>
        {devices.map((device, index) => (
          <View key={device.id} className="mb-1">
            <Text className="text-sm font-medium">{device.nickname}</Text>
            <Text className="text-xs text-gray-500">{device.macAddress}</Text>
          </View>
        ))}
      </View>
    );
  };

  const handleSearchUser = () => {
    console.log("Searching for user:", searchUsername);
  };
  const handleSetupWifiConfig = () => {
    setWifiConfigModalVisible(true);
  };

  const handleUpdateWifiConfig = () => {
    router.replace(`/screens/WifiConfig/${groupId}`);
  };

  if (!groupData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </View>
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
            {groupData.name}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-2">
        {/* Members and Devices Table */}
        <View className="bg-white rounded-xl shadow-sm mb-6">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">
              Members and Devices
            </Text>
          </View>
          <View className="border border-gray-200 rounded-b-xl">
            {/* Table Header */}
            <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
              <View style={{ width: "35%" }}>
                <Text className="font-semibold text-gray-700">Member</Text>
              </View>
              <View style={{ width: "55%" }}>
                <Text className="font-semibold text-gray-700">Devices</Text>
              </View>
              <View style={{ width: "10%" }} className="items-center">
                <Text className="font-semibold text-gray-700 text-center">
                  Add
                </Text>
              </View>
            </View>

            {/* Table Rows */}
            {groupData.members.map((member, index) => (
              <View
                key={member.id}
                className={`flex-row p-3 ${index <= groupData.members.length - 1 ? "border-b border-gray-200" : ""}`}
              >
                {/* Member Column */}
                <View style={{ width: "35%" }} className="justify-center">
                  <View className="flex-row items-center">
                    {/* <View className="h-8 w-8 rounded-full bg-blue-100 mr-2 items-center justify-center">
                <Ionicons name="person" size={16} color="#3b82f6" />
              </View> */}
                    <Text className="font-medium text-gray-800">
                      {member.username}
                    </Text>
                  </View>
                </View>

                {/* Devices Column */}
                <View style={{ width: "55%" }} className="justify-center px-2">
                  {renderDevicesCell(member.devices)}
                </View>

                {/* Action Column */}
                <View
                  style={{ width: "10%" }}
                  className="justify-center items-center"
                >
                  <TouchableOpacity
                    onPress={() => openAddDeviceModal(member)}
                    className="h-8 w-8 rounded-full bg-blue-500 items-center justify-center"
                  >
                    <Ionicons name="add" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          {/* Add New User Button */}
          <View className="mt-4 p-4">
            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-lg items-center"
              onPress={() => setAddUserModalVisible(true)}
            >
              <Text className="text-white font-bold text-base">
                Add New User
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add User Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={addUserModalVisible}
            onRequestClose={() => setAddUserModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <View className="bg-white rounded-xl p-6 mx-4 w-80">
                <Text className="text-lg font-bold mb-4 text-center">
                  Add User to Group
                </Text>
                <Text className="text-gray-700 font-medium mb-2">
                  Username:
                </Text>
                <View className="flex-row items-center mb-4">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-base"
                    placeholder="Enter username"
                    value={searchUsername}
                    onChangeText={setSearchUsername}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="ml-2 bg-blue-500 p-3 rounded-lg"
                    onPress={handleSearchUser}
                    disabled={searchingUser}
                  >
                    <Ionicons name="search" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                {searchingUser && (
                  <Text className="text-gray-500 mb-2 text-center">
                    Searching...
                  </Text>
                )}
                {searchedUser && (
                  <TouchableOpacity
                    className="bg-gray-100 py-3 px-4 rounded-lg mb-4 items-center"
                    onPress={() => handleAddUserToGroup(searchedUser)}
                  >
                    <Text className="text-base font-medium text-blue-700">
                      {searchedUser.username}
                    </Text>
                    <Text className="text-xs text-gray-500">Tap to add</Text>
                  </TouchableOpacity>
                )}
                {searchError ? (
                  <Text className="text-red-500 mb-2 text-center">
                    {searchError}
                  </Text>
                ) : null}
                <TouchableOpacity
                  className="bg-gray-300 py-3 rounded-lg items-center"
                  onPress={() => {
                    setAddUserModalVisible(false);
                    setSearchUsername("");
                    setSearchedUser(null);
                    setSearchError("");
                  }}
                >
                  <Text className="text-gray-700 font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <View className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">
              WiFi Configurations
            </Text>
          </View>

          <View className="p-4">
            {groupData.wifiConfig ? (
              <View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-500">Network ID</Text>
                  <Text className="text-base font-medium">
                    {groupData.wifiConfig.networkId}
                  </Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-500">SSID</Text>
                  <Text className="text-base font-medium">
                    {groupData.wifiConfig.ssid}
                  </Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-500">Capacity</Text>
                  <Text className="text-base font-medium">
                    {groupData.wifiConfig.capacityMbps} Mbps
                  </Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-500">Status</Text>
                  <View className="flex-row items-center">
                    <View
                      className={`h-2 w-2 rounded-full mr-2 ${groupData.wifiConfig.isActive ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <Text className="text-base font-medium">
                      {groupData.wifiConfig.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-500">Frequency</Text>
                  <Text className="text-base font-medium">
                    {groupData.wifiConfig.frequency}
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className="text-sm text-gray-500">Security</Text>
                  <Text className="text-base font-medium">
                    {groupData.wifiConfig.securityType}
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-blue-500 py-3 rounded-lg items-center"
                  onPress={handleUpdateWifiConfig}
                >
                  <Text className="text-white font-bold">
                    Update WiFi Configurations
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-6">
                <Ionicons name="wifi-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 text-center mb-4 mt-2">
                  No WiFi configurations set up for this group
                </Text>
                <TouchableOpacity
                  className="bg-blue-500 py-3 px-6 rounded-lg"
                  onPress={handleSetupWifiConfig}
                >
                  <Text className="text-white font-bold">
                    Set up WiFi Configurations
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Device Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-white">
          <View className="bg-white rounded-t-xl px-4 pt-4 pb-8 border border-gray-300 mx-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">
                Add Device for {selectedMember?.username}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-700 font-medium mb-2">
              Device Nickname:
            </Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-base mb-4"
              placeholder="Enter device nickname (e.g., My iPhone)"
              value={deviceNickname}
              onChangeText={setDeviceNickname}
            />

            <Text className="text-gray-700 font-medium mb-2">MAC Address:</Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-base mb-6"
              placeholder="Enter MAC address (e.g., 00:1B:44:11:3A:B7)"
              value={deviceMacAddress}
              onChangeText={setDeviceMacAddress}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-lg items-center"
              onPress={handleAddDevice}
            >
              <Text className="text-white font-bold text-lg">Save Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* WiFi Config Modal Placeholder */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={wifiConfigModalVisible}
        onRequestClose={() => setWifiConfigModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-xl p-6 mx-4 w-80">
            <Text className="text-lg font-bold mb-4 text-center">
              WiFi Configuration
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              WiFi configuration setup will be implemented here
            </Text>
            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-lg items-center"
              onPress={() => setWifiConfigModalVisible(false)}
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageGroupScreen;
