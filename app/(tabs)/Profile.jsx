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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Btn from "../../components/Btn";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { UserContext } from "../../context/UserContext";
import Input from "../../components/Input";

const Profile = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [viewMode, setViewMode] = useState("profile"); 
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phone,
        // profilePicture: user.profilePicture,
      });
      setFormData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phone,
        // profilePicture: formData.profilePicture,
      });
    } else {
      router.replace("/(auth)/login");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      //todo: Call your API to update the profile
      const response = { ok: true }; // delete this line and replace with actual API call
      
      if (response.ok) {
        // Update local user data
        setUserData({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          profilePicture: formData.profilePicture,
        });
        
        // Update user context
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phoneNumber,
          profilePicture: formData.profilePicture,
        });
        
        Alert.alert("Success", "Profile updated successfully");
        setViewMode("profile");
      } else {
        Alert.alert("Error", result.message || "Failed to update profile");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating your profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        Alert.alert("Sign Out", "You have been signed out successfully.");
        router.replace("/(auth)/login");
      })
      .catch((error) => {
        Alert.alert("Sign Out Error", error.message);
      });
  };

  const onPasswordChange = async () => {
    console.log(oldPassword, newPassword, confirmPassword);

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
      setIsLoading(true);
      //todo: Call your API to change the password
      const response = { ok: true }; // delete this line and replace with actual API call
      
      if (response.ok) {
        Alert.alert("Success", "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setViewMode("profile");
      } else {
        Alert.alert("Error", result.message || "Failed to change password");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while changing your password");
      console.error(error);
    } finally {
      setIsLoading(false);
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
              userData?.profilePicture
                ? { uri: userData.profilePicture }
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
          <Text className="text-black">{userData?.name}</Text>
        </View>
        <View className="flex-row mb-3">
          <Text className="text-gray-500 w-1/3">Email :</Text>
          <Text className="text-black">{userData?.email}</Text>
        </View>
        <View className="flex-row">
          <Text className="text-gray-500 w-1/3">Phone Number:</Text>
          <Text className="text-black">{userData?.phoneNumber}</Text>
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
        className="mx-4 mt-4 bg-gray-100 rounded-xl p-4 w-full"
        onPress={signout}
      >
        <Text className="text-center text-gray-700 font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const UpdateProfileView = () => {
    const handleImagePicker = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

          if (!result.canceled) {
            // Update the profile picture with the selected image
            setFormData({ ...formData, profilePicture: result.assets[0].uri });
          };
        } catch (error) {
          Alert.alert("Error", "An error occurred while selecting the image");
          console.error(error);
        };
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
              className="absolute bottom-0 right-0 bg-gray-300 p-1 rounded-full"
              onPress={handleImagePicker}
            >
              <Ionicons name="add" size={20} color="#000" />
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
          />
          <Text className="text-gray-500 mb-1">Email :</Text>
          <Input
            value={formData?.email}
            onChange={(text) => setFormData({ ...formData, email: text })}
          />
          <Text className="text-gray-500 mb-1">Phone Number:</Text>
          <Input
            value={formData?.phoneNumber}
            onChange={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
          />
            <Btn
              text={isLoading ? "Updating..." : "Update"}
              onPress={handleUpdate}
              disabled={isLoading}
            />
            <TouchableOpacity style={clearButtonStyle} onPress={() => setViewMode("profile")}>
              <Text className="text-blue-500 text-center text-lg font-semibold">
                Clear
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ChangePasswordView = () => (
    <View className="flex-1">
      <View className="bg-blue-500 py-4 flex-row items-center mt-4 px-6">
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
              text={isLoading ? "Changing..." : "Change"}
              onPress={onPasswordChange}
              disabled={isLoading}
            />
            <TouchableOpacity style={clearButtonStyle} onPress={changePasswordClear}>
              <Text className="text-blue-500 text-center text-lg font-semibold">
                Clear
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

  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1">
        {viewMode === "profile" && (
          <View className="bg-blue-500 py-4 mt-4">
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
