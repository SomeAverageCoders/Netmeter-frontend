// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import MyUsage from '../screens/MyUsage';
// import GroupUsage from '../screens/GroupUsage';

// const Usage = () => {
//   const [activeUsageTab, setActiveUsageTab] = useState<'my' | 'group'>('my');

//   const handleCheckBillShare = () => {
//     // Handle bill share navigation
//     console.log('Navigate to Bill Share');
//   };

//   const handleCheckBillSummary = () => {
//     // Handle bill summary navigation
//     console.log('Navigate to Bill Summary');
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
//       {/* Header */}
//       <View className="bg-blue-500 py-4 px-4">
//         <Text className="text-white text-xl font-bold text-center">
//           {activeUsageTab === 'my' ? 'Personal Usage' : 'Usage Summary'}
//         </Text>
//       </View>

//       {/* Main Usage Type Tabs */}
//       <View className="bg-white px-4 shadow-sm">
//         <View className="flex-row">
//           <TouchableOpacity
//             onPress={() => setActiveUsageTab('my')}
//             className={`flex-1 py-3 border-b-2 ${
//               activeUsageTab === 'my'
//                 ? 'border-blue-500 bg-blue-50'
//                 : 'border-transparent'
//             }`}
//           >
//             <Text
//               className={`text-center font-medium ${
//                 activeUsageTab === 'my' ? 'text-blue-500' : 'text-gray-600'
//               }`}
//             >
//               My USAGE
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             onPress={() => setActiveUsageTab('group')}
//             className={`flex-1 py-3 border-b-2 ${
//               activeUsageTab === 'group'
//                 ? 'border-blue-500 bg-blue-50'
//                 : 'border-transparent'
//             }`}
//           >
//             <Text
//               className={`text-center font-medium ${
//                 activeUsageTab === 'group' ? 'text-blue-500' : 'text-gray-600'
//               }`}
//             >
//               Group USAGE
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Render the appropriate component based on active tab */}
//       {activeUsageTab === 'my' ? (
//         <MyUsage onCheckBillShare={handleCheckBillShare} />
//       ) : (
//         <GroupUsage onCheckBillSummary={handleCheckBillSummary} />
//       )}
//     </SafeAreaView>
//   );
// };

// export default Usage;


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyUsage from '../screens/MyUsage';
import GroupUsage from '../screens/GroupUsage';
import { router } from 'expo-router';
import { useUser } from "../../context/UserContext";

// Mock group data (replace with API data later)
const mockGroups = [
  { id: 'group1', name: 'Uni Bording' },
  { id: 'group2', name: 'New Group' },
  { id: 'group3', name: 'Testers' },
];

const Usage = () => {
  const { user, isLoading } = useUser();
  const [activeUsageTab, setActiveUsageTab] = useState<'my' | 'group'>('my');
  const [selectedGroup, setSelectedGroup] = useState(mockGroups[0]);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  const handleCheckBillShare = () => {
    // Handle bill share navigation
    console.log('Navigate to Bill Share');
    router.push(`/screens/MyQuota/${user.id}`);
  };

  const handleCheckBillSummary = () => {
    // Handle bill summary navigation
    console.log('Navigate to Bill Summary');
    router.push(`/screens/BillingHistory`);
  };

  const handleSelectGroup = (group: { id: string; name: string }) => {
    setSelectedGroup(group);
    setGroupModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      {/* Header with group selector */}
      <View className="bg-blue-500 py-4 px-4 flex-row items-center justify-center">
        {/* Group selector */}
        <TouchableOpacity
          className="flex-row items-center mr-2 bg-blue-400 px-3 py-1 rounded-full"
          onPress={() => setGroupModalVisible(true)}
        >
          <Text className="text-white text-lg font-bold mr-1">
            {selectedGroup.name.slice(0, 2)}
          </Text>
          <Ionicons name="chevron-down" size={18} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold text-center flex-1">
          {activeUsageTab === 'my' ? 'Personal Usage' : 'Usage Summary'}
        </Text>
      </View>

      {/* Group selection modal */}
      <Modal
        visible={groupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
          <View className="bg-white rounded-xl p-4 w-72">
            <Text className="text-lg font-bold mb-4 text-center">Select Group</Text>
            <FlatList
              data={mockGroups}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-3 px-4 rounded-lg mb-2 ${item.id === selectedGroup.id ? 'bg-blue-100' : 'bg-gray-100'}`}
                  onPress={() => handleSelectGroup(item)}
                >
                  <Text className="text-base text-gray-800 font-semibold">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="mt-2 py-2 rounded-lg items-center bg-gray-200"
              onPress={() => setGroupModalVisible(false)}
            >
              <Text className="text-gray-700 font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Usage Type Tabs */}
      <View className="bg-white px-4 shadow-sm">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveUsageTab('my')}
            className={`flex-1 py-3 border-b-2 ${
              activeUsageTab === 'my'
                ? 'border-blue-500 bg-blue-50'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeUsageTab === 'my' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              My USAGE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveUsageTab('group')}
            className={`flex-1 py-3 border-b-2 ${
              activeUsageTab === 'group'
                ? 'border-blue-500 bg-blue-50'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeUsageTab === 'group' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              Group USAGE
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render the appropriate component based on active tab, pass selectedGroup as prop */}
      {activeUsageTab === 'my' ? (
        <MyUsage onCheckBillShare={handleCheckBillShare} group={selectedGroup} />
      ) : (
        <GroupUsage onCheckBillSummary={handleCheckBillSummary} group={selectedGroup} />
      )}
    </SafeAreaView>
  );
};

export default Usage;