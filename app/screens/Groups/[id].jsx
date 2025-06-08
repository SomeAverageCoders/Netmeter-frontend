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
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
// import { useUser } from "../../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageGroupScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // const { user } = useUser();
  const groupId = route.params?.id;
  console.log("Group ID:", groupId);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      console.log("Fetching token from AsyncStorage");
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setToken(token);
          console.log("Token found:", token);
        } else {
          console.log("No token found, redirecting to login");
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        router.replace("/(auth)/login");
      }
    };
    fetchToken();
  }, []);
  const [groupData, setGroupData] = useState(null);
  const [wifiData, setWifiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deviceNickname, setDeviceNickname] = useState("");
  const [deviceMacAddress, setDeviceMacAddress] = useState("");
  // const [wifiConfigModalVisible, setWifiConfigModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [addingDevice, setAddingDevice] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);
  const [removingDevice, setRemovingDevice] = useState(null);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [removalType, setRemovalType] = useState("");
  const [itemToRemove, setItemToRemove] = useState(null);
  const [memberNameForDevice, setMemberNameForDevice] = useState("");
  const [deviceOwnerUserId, setDeviceOwnerUserId] = useState(null);

  // Fetch group members and devices
  const fetchGroupData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/groups/${groupId}/members-with-devices`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch group data");
      }
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error("Error fetching group data:", error);
      Alert.alert("Error", "Failed to load group data. Please try again.");
    }
  };

  // Fetch WiFi configuration
  const fetchWifiData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/wifi/${groupId}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        if (response.status === 404) {
          // No WiFi config found
          setWifiData(null);
          return;
        }
        throw new Error("Failed to fetch WiFi data");
      }
      const data = await response.json();
      setWifiData(data);
    } catch (error) {
      console.error("Error fetching WiFi data:", error);
      // Don't show alert for WiFi data as it might not exist
      setWifiData(null);
    }
  };

  useEffect(() => {
    if (groupId) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchGroupData(), fetchWifiData()]);
        setLoading(false);
      };
      loadData();
    }
  }, [groupId]);

  const openAddDeviceModal = (member) => {
    setSelectedMember(member);
    setDeviceNickname("");
    setDeviceMacAddress("");
    setModalVisible(true);
  };

  const handleAddDevice = async () => {
    console.log("Adding device for member:", selectedMember.id);
    if (
      deviceNickname.trim() === "" ||
      deviceMacAddress.trim() === "" ||
      !selectedMember
    ) {
      Alert.alert("Error", "Please enter both device nickname and MAC address");
      return;
    }
    console.log("before validation", deviceMacAddress.trim());
    // Normalize MAC address: remove spaces, convert to uppercase, replace any separator with :
    let normalizedMac = deviceMacAddress
      .trim()
      .toUpperCase()
      .replace(/[^0-9A-F]/g, ":");
    // Remove duplicate colons
    normalizedMac = normalizedMac.replace(/:+/g, ":");
    // Remove leading/trailing colons
    normalizedMac = normalizedMac.replace(/^:|:$/g, "");
    // Basic MAC address validation (accepts : or - as separator)
    const macRegex = /^([0-9A-F]{2}[:-]?){5}[0-9A-F]{2}$/;
    if (!macRegex.test(normalizedMac)) {
      Alert.alert(
        "Error",
        "Please enter a valid MAC address (e.g., 00:1B:44:11:3A:B7)"
      );
      return;
    }
    // Use normalized MAC address for submission
    setDeviceMacAddress(normalizedMac);
    console.log("after validation", normalizedMac);
    setAddingDevice(true);

    try {
      const response = await fetch("http://localhost:3000/devices/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedMember.id,
          groupId: parseInt(groupId),
          name: deviceNickname.trim(),
          macAddress: deviceMacAddress.trim().toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add device");
      }

      // Close modal and reset form
      setModalVisible(false);
      setDeviceNickname("");
      setDeviceMacAddress("");

      // Refresh group data to show the new device
      await fetchGroupData();

      Alert.alert("Success", "Device added successfully!");
    } catch (error) {
      console.error("Error adding device:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to add device. Please try again."
      );
    } finally {
      setAddingDevice(false);
    }
  };

  const RemovalModal = () => (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 24,
          width: "80%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
          {`Remove ${removalType === "member" ? "Member" : "Device"}`}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 24, textAlign: "center" }}>
          {removalType === "member"
            ? `Are you sure you want to remove ${itemToRemove?.name} from this group?`
            : `Are you sure you want to remove "${itemToRemove?.name}" from this group?`}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#ddecff",
              padding: 12,
              borderRadius: 8,
              marginRight: 8,
              alignItems: "center",
            }}
            onPress={() => {
              setShowRemovalModal(false);
              setItemToRemove(null);
              setRemovalType("");
              setMemberNameForDevice("");
              setDeviceOwnerUserId(null);
            }}
          >
            <Text style={{ color: "#3B82F6", fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#fee2e2",
              padding: 12,
              borderRadius: 8,
              marginLeft: 8,
              alignItems: "center",
            }}
            onPress={confirmRemoval}
          >
            <Text style={{ color: "#dc2626", fontWeight: "bold" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  // Updated handleRemoveMember function
  const handleRemoveMember = (member) => {
    setItemToRemove(member);
    setRemovalType("member");
    setShowRemovalModal(true);
  };

  // Updated handleRemoveDevice function
  const handleRemoveDevice = (device, memberName, userId) => {
    setItemToRemove(device);
    setRemovalType("device");
    setMemberNameForDevice(memberName);
    setDeviceOwnerUserId(userId);
    setShowRemovalModal(true);
  };

  // New confirmRemoval function that handles the actual removal
  const confirmRemoval = async () => {
    if (removalType === "member") {
      // Remove member logic
      setRemovingMember(itemToRemove.id);

      try {
        const response = await axios.delete(
          `http://localhost:3000/groups/${groupId}/remove-member/${itemToRemove.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Refresh group data to show updated members
        await fetchGroupData();

        console.log(
          "Success",
          `${itemToRemove.name} has been removed from the group.`
        );
      } catch (error) {
        console.error("Error removing member:", error);
        Alert.alert(
          "Error",
          error.message || "Failed to remove member. Please try again."
        );
      } finally {
        setRemovingMember(null);
      }
    } else if (removalType === "device") {
      // Remove device logic
      setRemovingDevice(itemToRemove.id);

      try {
        const response = await axios.delete(
          `http://localhost:3000/devices/${itemToRemove.id}/group/${groupId}/user/${deviceOwnerUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Remove device response:", response);

        // Refresh group data to show updated devices
        await fetchGroupData();

        Alert.alert(
          "Success",
          `"${itemToRemove.name}" has been removed from the group.`
        );
      } catch (error) {
        console.error("Error removing device:", error);
        Alert.alert(
          "Error",
          error.response?.data?.message ||
            "Failed to remove device. Please try again."
        );
      } finally {
        setRemovingDevice(null);
      }
    }

    // Close modal and reset state
    setShowRemovalModal(false);
    setItemToRemove(null);
    setRemovalType("");
    setMemberNameForDevice("");
    setDeviceOwnerUserId(null);
  };

  // Search for users functionality (from CreateGroupScreen)
  const handleSearchUser = async () => {
    if (searchUsername.trim() === "") {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/users/search?name=${encodeURIComponent(searchUsername)}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Search response:", response.data);

      // Handle different possible response structures
      let users = [];
      if (response.data.users) {
        users = response.data.users;
      } else if (response.data.data) {
        users = response.data.data;
      } else if (Array.isArray(response.data)) {
        users = response.data;
      }

      console.log("Processed users:", users);

      // Filter out users that are already in the group
      const currentMemberIds = groupData.members.map((member) => member.id);
      const filteredUsers = users.filter(
        (user) => !currentMemberIds.includes(user.id)
      );

      setSearchResults(filteredUsers);

      if (filteredUsers.length === 0 && users.length > 0) {
        Alert.alert("No Results", "All found users are already in this group");
      } else if (filteredUsers.length === 0) {
        Alert.alert("No Results", "No users found matching your search");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      Alert.alert("Error", "Failed to search users. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Add user to group
  const handleAddUserToGroup = async (user) => {
    setAddingMember(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/groups/${groupId}/add-member/${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Add member response:", response.data);

      // Close modal and reset form
      setAddUserModalVisible(false);
      setSearchUsername("");
      setSearchResults([]);

      // Refresh group data to show the new member
      await fetchGroupData();

      Alert.alert(
        "Success",
        `${user.name || user.username} has been added to the group!`
      );
    } catch (error) {
      console.error("Add member error:", error);
      let errorMessage = "Failed to add user to group. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setAddingMember(false);
    }
  };

  const renderDevicesCell = (devices, memberName, memberId) => {
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
          <View
            key={device.id}
            className="mb-2 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-sm font-medium">{device.name}</Text>
              {device.macAddress && (
                <Text className="text-xs text-gray-500">
                  {device.macAddress}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveDevice(device, memberName, memberId)}
              className="pr-6"
              disabled={removingDevice === device.id}
            >
              {removingDevice === device.id ? (
                <Ionicons name="hourglass" size={12} color="#ef4444" />
              ) : (
                <Ionicons name="close-circle" size={14} color="#ef4444" />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const handleSetupWifiConfig = () => {
    // setWifiConfigModalVisible(true);
    router.push(`/screens/WifiConfig/${groupId}`);
  };

  const handleUpdateWifiConfig = () => {
    router.replace(`/screens/WifiConfig/${groupId}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!groupData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-red-500">
            Failed to load group data
          </Text>
          <TouchableOpacity
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => {
              setLoading(true);
              fetchGroupData().then(() => setLoading(false));
            }}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
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
              <View style={{ width: "30%" }}>
                <Text className="font-semibold text-gray-700">Member</Text>
              </View>
              <View style={{ width: "55%" }}>
                <Text className="font-semibold text-gray-700">Devices</Text>
              </View>
              <View style={{ width: "15%" }} className="items-center">
                <Text className="font-semibold text-gray-700 text-center">
                  Actions
                </Text>
              </View>
            </View>

            {/* Table Rows */}
            {groupData.members &&
              groupData.members.map((member, index) => (
                <View
                  key={member.id}
                  className={`flex-row p-3 ${index < groupData.members.length ? "border-b border-gray-300" : ""}`}
                >
                  {/* Member Column */}
                  <View style={{ width: "30%" }} className="justify-center">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-medium text-gray-800 flex-1">
                        {member.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(member)}
                        className="pr-6"
                        disabled={removingMember === member.id}
                      >
                        {removingMember === member.id ? (
                          <Ionicons
                            name="hourglass"
                            size={12}
                            color="#ef4444"
                          />
                        ) : (
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color="#ef4444"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Devices Column */}
                  <View style={{ width: "55%" }} className="justify-center">
                    {renderDevicesCell(member.devices, member.name, member.id)}
                  </View>

                  {/* Action Column */}
                  <View
                    style={{ width: "15%" }}
                    className="justify-center items-center"
                  >
                    <TouchableOpacity
                      onPress={() => openAddDeviceModal(member)}
                      className="h-6 w-6 rounded-full bg-blue-500 items-center justify-center"
                    >
                      <Ionicons name="add" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>

          {/* Add New User Button */}
          <View className="mt-4 p-4 justify-right items-center">
            <TouchableOpacity
              className="bg-blue-500 py-3 px-4 rounded-lg items-center w-1/2"
              onPress={() => setAddUserModalVisible(true)}
            >
              <Text className="text-white font-bold">Add New User</Text>
            </TouchableOpacity>
          </View>

          {/* Add User Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={addUserModalVisible}
            onRequestClose={() => {
              setAddUserModalVisible(false);
              setSearchUsername("");
              setSearchResults([]);
            }}
          >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <View className="bg-white rounded-xl p-6 mx-4 w-80 max-h-96">
                <Text className="text-lg font-bold mb-4 text-center">
                  Add User to Group
                </Text>

                {/* Search Section */}
                <Text className="text-gray-700 font-medium mb-2">
                  Search Users:
                </Text>
                <View className="flex-row items-center mb-4">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-base"
                    placeholder="Enter username"
                    value={searchUsername}
                    onChangeText={setSearchUsername}
                    onSubmitEditing={handleSearchUser}
                    returnKeyType="search"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className={`ml-2 p-3 rounded-lg ${searching || searchUsername.trim() === "" ? "bg-gray-400" : "bg-blue-500"}`}
                    onPress={handleSearchUser}
                    disabled={searching || searchUsername.trim() === ""}
                  >
                    <Ionicons
                      name={searching ? "hourglass" : "search"}
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Status */}
                {searching && (
                  <View className="bg-blue-50 p-3 rounded-lg mb-4">
                    <Text className="text-blue-600 text-center">
                      Searching for users...
                    </Text>
                  </View>
                )}

                {/* Search Results */}
                {!searching && searchResults.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-gray-700 text-base mb-3 font-medium">
                      Search Results ({searchResults.length})
                    </Text>
                    <View className="max-h-32">
                      <FlatList
                        data={searchResults}
                        keyExtractor={(item, index) =>
                          item.id ? item.id.toString() : `search-${index}`
                        }
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            className="bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between"
                            onPress={() => handleAddUserToGroup(item)}
                            activeOpacity={0.7}
                            disabled={addingMember}
                          >
                            <View className="flex-1">
                              <Text className="text-base font-medium text-blue-800">
                                {item.name || item.username || "Unknown User"}
                              </Text>
                              {item.email && (
                                <Text className="text-sm text-blue-600 mt-1">
                                  {item.email}
                                </Text>
                              )}
                            </View>
                            <View className="bg-blue-500 px-3 py-1 rounded-full">
                              <Text className="text-white text-xs font-medium">
                                {addingMember ? "Adding..." : "Add"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={true}
                      />
                    </View>
                  </View>
                )}

                {/* No Results Message */}
                {!searching &&
                  searchUsername.trim() !== "" &&
                  searchResults.length === 0 && (
                    <View className="bg-gray-50 p-4 rounded-lg mb-4">
                      <Text className="text-gray-600 text-center">
                        No users found for "{searchUsername}"
                      </Text>
                    </View>
                  )}

                {/* Cancel Button */}
                <TouchableOpacity
                  className="bg-gray-300 py-3 rounded-lg items-center"
                  onPress={() => {
                    setAddUserModalVisible(false);
                    setSearchUsername("");
                    setSearchResults([]);
                  }}
                  disabled={addingMember}
                >
                  <Text className="text-gray-700 font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* WiFi Configuration Section */}
        <View className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">
              WiFi Configurations
            </Text>
          </View>

          <View className="p-4">
            {wifiData ? (
              <View>
                {wifiData.networkName && (
                  <View className="mb-3">
                    <Text className="text-sm text-gray-500">Network Name</Text>
                    <Text className="text-base font-medium">
                      {wifiData.networkName}
                    </Text>
                  </View>
                )}
                {wifiData.ssid && (
                  <View className="mb-3">
                    <Text className="text-sm text-gray-500">SSID</Text>
                    <Text className="text-base font-medium">
                      {wifiData.ssid}
                    </Text>
                  </View>
                )}
                {wifiData.dataQuota && (
                  <View className="mb-3">
                    <Text className="text-sm text-gray-500">Data Quota</Text>
                    <Text className="text-base font-medium">
                      {wifiData.dataQuota}
                    </Text>
                  </View>
                )}
                {wifiData.hasOwnProperty("status") && (
                  <View className="mb-3">
                    <Text className="text-sm text-gray-500">Status</Text>
                    <View className="flex-row items-center">
                      <View
                        className={`h-2 w-2 rounded-full mr-2 ${wifiData.status ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <Text className="text-base font-medium">
                        {wifiData.status ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>
                )}
                {wifiData.dailyUsageLimitPerMember && (
                  <View className="mb-3">
                    <Text className="text-sm text-gray-500">
                      Daily Usage Limit Per Member
                    </Text>
                    <Text className="text-base font-medium">
                      {wifiData.dailyUsageLimitPerMember}
                    </Text>
                  </View>
                )}

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
        <View className="flex-1 justify-center bg-black bg-opacity-50">
          <View className="bg-white rounded-t-xl px-4 pt-4 pb-8 border border-gray-300 mx-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">
                Add Device for {selectedMember?.name}
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
              placeholderTextColor={"#9ca3af"}
              value={deviceNickname}
              onChangeText={setDeviceNickname}
              editable={!addingDevice}
            />

            <Text className="text-gray-700 font-medium mb-2">MAC Address:</Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-base mb-6"
              placeholder="Enter MAC address (e.g., 00:1B:44:11:3A:B7)"
              placeholderTextColor={"#9ca3af"}
              value={deviceMacAddress}
              onChangeText={setDeviceMacAddress}
              autoCapitalize="characters"
              editable={!addingDevice}
            />

            <TouchableOpacity
              className={`py-4 rounded-lg items-center ${addingDevice ? "bg-gray-400" : "bg-blue-500"}`}
              onPress={handleAddDevice}
              disabled={addingDevice}
            >
              <Text className="text-white font-bold text-lg">
                {addingDevice ? "Adding Device..." : "Save Device"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {showRemovalModal && <RemovalModal />}
    </SafeAreaView>
  );
};

export default ManageGroupScreen;