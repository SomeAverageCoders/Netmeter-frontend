// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

// // Mock data for user search - replace with API calls in production
// const mockUsers = [
//   { id: '8', username: 'alex_dev' },
//   { id: '9', username: 'emma_design' },
//   { id: '10', username: 'david_manager' },
//   { id: '11', username: 'sophia_ui' },
//   { id: '12', username: 'ryan_code' },
//   { id: '13', username: 'olivia_test' },
// ];

// const SearchUserScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { groupId, onUserAdded } = route.params || {};

//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);

//   // Search for users
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === '') {
//       setSearchResults([]);
//       return;
//     }

//     // Filter users based on search query
//     const filteredUsers = mockUsers.filter(user => 
//       user.username.toLowerCase().includes(query.toLowerCase())
//     );
//     setSearchResults(filteredUsers);
//   };

//   // Add a user to the group and navigate back
//   const handleSelectUser = (user) => {
//     if (onUserAdded) {
//       onUserAdded(user);
//     }
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView className='flex-1 bg-gray-100'>
//       {/* Header */}
//       <View className='bg-blue-500 pt-12 pb-4 px-4'>
//         <View className='flex-row items-center'>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text className='text-white text-2xl font-bold ml-4'>Add User</Text>
//         </View>
//       </View>

//       {/* Search Input */}
//       <View className='p-4'>
//         <TextInput
//           className='bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4'
//           placeholder="Search by username"
//           value={searchQuery}
//           onChangeText={handleSearch}
//           autoFocus
//         />
//       </View>

//       {/* Search Results */}
//       <FlatList
//         data={searchResults}
//         keyExtractor={(item) => item.id}
//         contentContainerclassName='px-4'
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             className='bg-white p-4 rounded-lg mb-2 flex-row justify-between items-center shadow-sm'
//             onPress={() => handleSelectUser(item)}
//           >
//             <View className='flex-row items-center'>
//               <View className='h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3'>
//                 <Text className='text-blue-500 font-bold'>{item.username.charAt(0).toUpperCase()}</Text>
//               </View>
//               <Text className='text-lg'>{item.username}</Text>
//             </View>
//             <Ionicons name="add-circle" size={24} color="#3b82f6" />
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={() => (
//           searchQuery.trim() !== '' && (
//             <View className='items-center justify-center py-8'>
//               <Text className='text-gray-500'>No users found</Text>
//             </View>
//           )
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// export default SearchUserScreen;