import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Btn from "../../components/Btn";
import { useUser } from "../../context/UserContext";
import Input from "../../components/Input";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SHA256 from "crypto-js/sha256";

const Profile = () => {
  const router = useRouter();
  const { user, setUser, logout, isLoading } = useUser();
  const [viewMode, setViewMode] = useState("profile"); 
  const [formData, setFormData] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Initialize form data with user context data when component mounts
    if (user) {
      console.log("User data loaded in Profile:", user);
      
      // Initialize form data with user context data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.mobile || user.phone || "",
        profilePicture: user.profilePicture || null,
      });
    } else if (!isLoading) {
      // If no user and not loading, redirect to login
      console.log("No user found, redirecting to login");
      router.replace("/(auth)/login");
    }
  }, [user, isLoading]);

  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert("Error", "Name and email are required");
      return;
    }

    try {
      setIsUpdating(true);
      
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.");
        router.replace("/(auth)/login");
        return;
      }

      // Call API to update the profile
      const response = await axios.put(
        `http://localhost:3000/users/${user.id}`,
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.phoneNumber,
          profilePicture: formData.profilePicture,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        // Update user context with new data
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          mobile: formData.phoneNumber,
          profilePicture: formData.profilePicture,
        };
        
        await setUser(updatedUser);
        
        Alert.alert("Success", "Profile updated successfully");
        setViewMode("profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      
      if (error.response?.status === 401) {
        Alert.alert("Error", "Session expired. Please login again.");
        router.replace("/(auth)/login");
      } else if (error.response?.status === 400) {
        Alert.alert("Error", error.response.data.message || "Invalid data provided");
      } else {
        Alert.alert("Error", "An error occurred while updating your profile");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Debug function to log AsyncStorage contents after logout
  const debugAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    console.log("AsyncStorage contents:", values);
  } catch (error) {
    console.error("Error reading AsyncStorage:", error);
  }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = async () => {
    console.log("Logout button pressed, showing confirmation modal...");
    // Use a custom modal instead of Alert for confirmation
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      console.log("Logout confirmed, starting logout process...");
      await debugAsyncStorage();
      await logout();
      await debugAsyncStorage();
      console.log("Logout successful, redirecting to login...");
      setShowLogoutModal(false);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      setShowLogoutModal(false);
      router.replace("/(auth)/login");
    }
  };

  // Custom Logout Modal component
  const ShowLogoutModal = () => (
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
            Logout
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 24, textAlign: "center" }}>
            Are you sure you want to logout?
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#ddecff",
                padding: 12,
                borderRadius: 8,
                marginRight: 8,
                alignItems: "center",
              }}
              onPress={() => setShowLogoutModal(false)}
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
              onPress={confirmLogout}
            >
              <Text style={{ color: "#dc2626", fontWeight: "bold" }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );

  const onPasswordChange = async () => {
    console.log("Password change attempt");

    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "New password and confirm password don't match");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Error", "New password must be at least 6 characters long");
    }

    try {
      setIsUpdating(true);
      
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.");
        router.replace("/(auth)/login");
        return;
      }

      // Hash passwords
      const hashedOldPassword = SHA256(oldPassword).toString();
      const hashedNewPassword = SHA256(newPassword).toString();

      // Call API to change the password
      const response = await axios.put(
        `http://localhost:3000/users/${user.id}/change-password`,
        {
          oldPassword: hashedOldPassword,
          newPassword: hashedNewPassword,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        Alert.alert("Success", "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setViewMode("profile");
      }
    } catch (error) {
      console.error("Password change error:", error);
      
      if (error.response?.status === 401) {
        Alert.alert("Error", "Session expired. Please login again.");
        router.replace("/(auth)/login");
      } else if (error.response?.status === 400) {
        Alert.alert("Error", error.response.data.message || "Invalid password provided");
      } else {
        Alert.alert("Error", "An error occurred while changing your password");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const changePasswordClear = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setViewMode("profile")
  }

  const ProfileView = () => (
    <View className="flex-1 justify-center items-center p-6">
      <View className="items-center mt-6">
        <View className="relative">
          <View className="bg-blue-500 rounded-full p-0.5">
          <Image
            source={
              user?.profilePicture
                ? { uri: user.profilePicture }
                : require("../../assets/images/user.png")
            }
            className="w-24 h-24 rounded-full"
            style={{ resizeMode: "cover" }}
          />
          </View>
        </View>
      </View>
      <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4 relative w-full">
        <Text className="text-lg font-bold mb-4">User Details:</Text>
        <TouchableOpacity
          className="absolute top-4 right-4"
          onPress={() => setViewMode("edit")}
        >
          <Ionicons name="pencil" size={20} color="#000" />
        </TouchableOpacity>
        <View className="flex-row mb-3">
          <Text className="text-gray-500 w-1/3">Name :</Text>
          <Text className="text-black">{user?.name || 'Not provided'}</Text>
        </View>
        <View className="flex-row mb-3">
          <Text className="text-gray-500 w-1/3">Email :</Text>
          <Text className="text-black">{user?.email || 'Not provided'}</Text>
        </View>
        <View className="flex-row mb-3">
          <Text className="text-gray-500 w-1/3">Phone :</Text>
          <Text className="text-black">{user?.mobile || user?.phone || 'Not provided'}</Text>
        </View>
        <View className="flex-row">
          <Text className="text-gray-500 w-1/3">Role :</Text>
          <Text className="text-black">{user?.userRole || 'User'}</Text>
        </View>
      </View>
      <TouchableOpacity 
        className="mx-4 mt-4 bg-gray-100 rounded-xl p-4 w-full"
        onPress={() => setViewMode("password")}
      >
        <Text className="text-center text-gray-700 font-bold">
          Change Password
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginHorizontal: 16,
          marginTop: 16,
          backgroundColor: "#fee2e2",
          borderRadius: 16,
          padding: 16,
          width: "100%",
        }}
        onPress={handleLogout}
      >
        <Text style={{ textAlign: "center", color: "#dc2626", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const UpdateProfileView = () => {
    const handleImagePicker = async () => {
      try {
        // Request permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
          Alert.alert("Permission Required", "Permission to access camera roll is required!");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled) {
          // Update the profile picture with the selected image
          setFormData({ ...formData, profilePicture: result.assets[0].uri });
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while selecting the image");
        console.error(error);
      }
    };

    return (
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mt-6">
          <View className="relative">
            <View className="bg-blue-500 rounded-full p-0.5">
              <Image
                source={
                  formData?.profilePicture
                    ? { uri: formData.profilePicture }
                    : require("../../assets/images/user.png")
                }
                className="w-24 h-24 rounded-full"
                style={{ resizeMode: "cover" }}
              />
            </View>
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full"
              onPress={handleImagePicker}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-full bg-gray-100 rounded-lg p-6 mt-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Profile
          </Text>
          <Text className="text-gray-500 mb-1">Name :</Text>
          <Input
            value={formData?.name}
            onChange={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
          />
          <Text className="text-gray-500 mb-1">Email :</Text>
          <Input
            value={formData?.email}
            onChange={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
          />
          <Text className="text-gray-500 mb-1">Phone Number:</Text>
          <Input
            value={formData?.phoneNumber}
            onChange={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
            placeholder="Enter your phone number"
          />
          <Btn
            text={isUpdating ? "Updating..." : "Update"}
            onPress={handleUpdate}
            disabled={isUpdating}
          />
          <TouchableOpacity 
            style={clearButtonStyle} 
            onPress={() => {
              // Reset form data to user data
              setFormData({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.mobile || user.phone || "",
                profilePicture: user.profilePicture || null,
              });
              setViewMode("profile");
            }}
          >
            <Text className="text-blue-500 text-center text-lg font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ChangePasswordView = () => (
    <View className="flex-1">
      <View className="bg-blue-500 py-4 flex-row items-center px-6">
        <TouchableOpacity onPress={() => setViewMode("profile")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold text-center flex-1">
          Change Password
        </Text>
      </View>
      
      <View className="flex-1 justify-center items-center p-6">
        <View className="w-full bg-gray-100 rounded-lg p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-10 text-center">
            Password Reset
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="Current password"
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            secureTextEntry
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry
          />
          <Btn
            text={isUpdating ? "Changing..." : "Change Password"}
            onPress={onPasswordChange}
            disabled={isUpdating}
          />
          <TouchableOpacity style={clearButtonStyle} onPress={changePasswordClear}>
            <Text className="text-blue-500 text-center text-lg font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (viewMode) {
      case "edit":
        return <UpdateProfileView />;
      case "password":
        return <ChangePasswordView />;
      default:
        return <ProfileView />;
    }
  };

  // Show loading spinner while checking user authentication
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no user after loading, show error message
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-gray-600 text-center mb-4">
            Unable to load user profile. Please login again.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text className="text-white font-bold">Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    showLogoutModal? 
    <ShowLogoutModal /> 
    : 
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <View className="flex-1">
        {viewMode === "profile" && (
          <View className="bg-blue-500 py-4">
            <Text className="text-white text-xl font-bold text-center">
              Profile
            </Text>
          </View>
        )}
        <ScrollView className="flex-1">
          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const clearButtonStyle = {
  backgroundColor: "#ddecff",
  paddingVertical: 10,
  paddingHorizontal: 16,
  marginTop: 8,
  borderRadius: 9999,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#3B82F6",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.5,
  elevation: 2,
};