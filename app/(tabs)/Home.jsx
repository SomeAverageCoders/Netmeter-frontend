import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import ImagePath from "../../constants/ImagePath";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mockGroups = [
  {
    id: '1',
    name: 'Uni Bording',
    members: [
      { id: '1', username: 'Rehan_123', devices: ['Galaxy A10-9867q', 'Dell aspire 5433', 'Iphone 8'] },
      { id: '2', username: 'Kevin_4J', devices: [] },
      { id: '3', username: 'Nikil_Fer', devices: [] },
      { id: '4', username: 'Peter_parker', devices: [] },
      { id: '5', username: 'jihan new', devices: [] },
    ],
  },
  {
    id: '2',
    name: 'Test Bording',
    members: [
      { id: '1', username: 'Rehan_123', devices: ['Galaxy A10-9867q', 'Dell aspire 5433', 'Iphone 8'] },
      { id: '2', username: 'Kevin_4J', devices: [] },
      { id: '3', username: 'Nikil_Fer', devices: [] },
      { id: '4', username: 'Peter_parker', devices: [] },
      { id: '5', username: 'jihan new', devices: [] },
    ],
  },
];

const Home = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  
  
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  
  // Fetch user's groups from API
  const fetchUserGroups = async () => {
    if (!user || !user.id) return;
    
    setLoadingGroups(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      
      if (!token) {
        console.log("No token found, user needs to login again");
        router.replace("/(auth)/login");
        return;
      }

      // Replace with your actual API endpoint
      const response = await axios.get(`http://localhost:3000/users/${user.id}/groups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("User groups fetched:", response.data);
      setGroups(response.data);
      
    } catch (error) {
      console.error("Error fetching user groups:", error);
      
      if (error.response?.status === 401) {
        // Token expired or invalid
        console.log("Token expired, redirecting to login");
        router.replace("/(auth)/login");
      } else {
        // For now, use mock data if API fails
        console.log("Using mock data due to API error");
        setGroups(mockGroups);
      }
    } finally {
      setLoadingGroups(false);
    }
  };
  
  // Fetch groups when user data is available
  useEffect(() => {
    if (user) {
      console.log('User data available:', user);
      fetchUserGroups();
    } else if (!isLoading) {
      console.log('No user data and not loading, redirecting to login');
      router.replace("/(auth)/login");
    }
  }, [user, isLoading]);

  const handleCreateGroup = () => {
    router.push('/screens/CreateGroupScreen');
  };

  const handleGroupPress = (group) => {
    console.log('Group Pressed:', group);
    router.push(`/screens/Groups/${group.id}`);
  };

  // Show loading spinner while checking user authentication
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no user after loading, redirect to login
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Redirecting to login...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const NewUserView = () => (
    <View className='flex-1 items-center justify-center p-4'>
       <View className='mb-8'>
        <Image 
          source={ImagePath.TeamSVG} 
          style={{ width: 400, height: 400 }}
          resizeMode="contain"
        />
      </View> 
      <TouchableOpacity 
        className='w-full bg-blue-500 py-4 px-6 rounded-full mb-4 items-center'
        onPress={handleCreateGroup}
      >
        <Text className='text-white text-lg font-bold'>Create a Group</Text>
      </TouchableOpacity>
    </View>
  );

  // For existing users with groups
  const ExistingUserView = () => (
    <View className='flex-1 items-center p-4'>
       <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4 relative w-full">
      <Text className='text-lg font-bold text-blue-500 mb-4'>Your Groups</Text>
      
      {loadingGroups ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Loading groups...</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className='my-2 bg-white rounded-lg shadow'
              onPress={() => handleGroupPress(item)}
            >
              <View className='p-4 border-b border-gray-200 '>
                <Text className='text-lg font-bold text-blue-500'>{item.name}</Text>
                <Text className='text-gray-600'>{item.members.length} members</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-gray-600">No groups found</Text>
              <Text className="text-gray-500 text-sm">Create your first group to get started</Text>
            </View>
          }
        />
      )}
      </View>
      <TouchableOpacity 
        className='absolute bottom-6 right-6 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg'
        onPress={handleCreateGroup}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <Link  href={{
          pathname: '/screens/BillingSummary/[id]',
          params: { id: user.id },
        }}>Billing summary</Link>
      <Link  href={`/screens/MyQuota/${user.id}`}>My Quota</Link>
      <Link  href={'/screens/BillingHistory'}>BillingHistory</Link>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <View className="flex-1">
          <View className="bg-blue-500 py-4">
              <Text className="text-white text-xl font-bold text-center">
                Welcome, {user.name || 'User'}
              </Text>
            </View>
          {/* Conditional rendering based on user status */}
          {groups.length === 0 && !loadingGroups ? <NewUserView /> : <ExistingUserView />}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});

// import React, { useState, useEffect, useContext } from 'react';
// import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Link, useRouter } from "expo-router";
// import ImagePath from "../../constants/ImagePath";
// import { useUser } from "../../context/UserContext";
// // or if you're using a local SVG file

// const mockGroups = [
//   {
//     id: '1',
//     name: 'Uni Bording',
//     members: [
//       { id: '1', username: 'Rehan_123', devices: ['Galaxy A10-9867q', 'Dell aspire 5433', 'Iphone 8'] },
//       { id: '2', username: 'Kevin_4J', devices: [] },
//       { id: '3', username: 'Nikil_Fer', devices: [] },
//       { id: '4', username: 'Peter_parker', devices: [] },
//       { id: '5', username: 'jihan new', devices: [] },
//     ],
//   },
//   {
//     id: '2',
//     name: 'Test Bording',
//     members: [
//       { id: '1', username: 'Rehan_123', devices: ['Galaxy A10-9867q', 'Dell aspire 5433', 'Iphone 8'] },
//       { id: '2', username: 'Kevin_4J', devices: [] },
//       { id: '3', username: 'Nikil_Fer', devices: [] },
//       { id: '4', username: 'Peter_parker', devices: [] },
//       { id: '5', username: 'jihan new', devices: [] },
//     ],
//   },
// ];

// const Home = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   type Group = {
//     id: string;
//     name: string;
//     members: {
//       id: string;
//       username: string;
//       devices: string[];
//     }[];
//   };
  
//   const [groups, setGroups] = useState<Group[]>([]);
  
//   // Simulate fetching user data and groups
//   useEffect(() => {
//     console.log('user data: ', user);
//     // setUser(mockUser);
//     setGroups(user.isNewUser ? [] : mockGroups);
//   }, []);

//   const handleCreateGroup = () => {
//     router.push('/screens/CreateGroupScreen' as any);
//   };

//   const handleGroupPress = (group: any) => {
//     console.log('Group Pressed:', group);
//     // router.push(`/screens/ManageGroup/${group.name}` as any);
//     router.push(`/screens/Groups/1` as any);
//   };

//   const handleSetupWifi = () => {
//     console.log('Setup Wi-Fi Configurations Pressed');
//   };

//   const NewUserView = () => (
//     <View className='flex-1 items-center justify-center p-4'>
//        <View className='mb-8'>
//         <Image 
//           source={ImagePath.TeamSVG} 
//           style={{ width: 400, height: 400 }}
//           resizeMode="contain"
//         />
//       </View> 
//       <TouchableOpacity 
//         className='w-full bg-blue-500 py-4 px-6 rounded-full mb-4 items-center'
//         onPress={handleCreateGroup}
//       >
//         <Text className='text-white text-lg font-bold'>Create a Group</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // For existing users with groups
//   const ExistingUserView = () => (
//     <View className='flex-1 items-center p-4'>
//        <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4 relative w-full">
//       <Text className='text-lg font-bold text-blue-500 mb-4'>Your Groups</Text>
//       <FlatList
//         data={groups}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             className='my-2 bg-white rounded-lg shadow'
//             onPress={() => handleGroupPress(item)}
//           >
//             <View className='p-4 border-b border-gray-200 '>
//               <Text className='text-lg font-bold text-blue-500'>{item.name}</Text>
//               <Text className='text-gray-600'>{item.members.length} members</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//       </View>
//       <TouchableOpacity 
//         className='absolute bottom-6 right-6 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg'
//         onPress={handleCreateGroup}
//       >
//         <Ionicons name="add" size={30} color="white" />
//       </TouchableOpacity>
//       <Link  href={{
//           pathname: '/screens/BillingSummary/[id]',
//           params: { id: '1' },
//         }}>Billing summary</Link>
//       <Link  href={'/screens/MyQuota/1'}>My Quota</Link>
//       <Link  href={'/screens/BillingHistory'}>BillingHistory</Link>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
//       <View className="flex-1">
//           <View className="bg-blue-500 py-4">
//               <Text className="text-white text-xl font-bold text-center">
//                 Home
//               </Text>
//             </View>
//           {/* Conditional rendering based on user status */}
//           {groups.length === 0 ? <NewUserView /> : <ExistingUserView />}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({})