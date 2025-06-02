import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log("User loaded from AsyncStorage:", parsedUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Enhanced setUser function that also saves to AsyncStorage
  const updateUser = async (userData) => {
    try {
      if (userData) {
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));
        console.log("User data saved to AsyncStorage:", userData);
      } else {
        await AsyncStorage.removeItem("user_data");
        console.log("User data removed from AsyncStorage");
      }
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
      // Still update the state even if AsyncStorage fails
      setUser(userData);
    }
  };

  // Fixed logout function to properly clear user data and return a Promise
  const logout = async () => {
    try {
      console.log("Starting logout process...");
      
      // Clear all user-related data from AsyncStorage
      const keysToRemove = ["user_data", "access_token", "user_id"];
      await AsyncStorage.multiRemove(keysToRemove);
      
      // Clear user state
      setUser(null);
      
      console.log("User logged out and data cleared successfully");
      
      // Return a resolved promise to indicate successful logout
      return Promise.resolve();
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear the user state
      setUser(null);
      // Return rejected promise to handle error in calling component
      return Promise.reject(error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: updateUser, 
      logout, 
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// import React, { createContext, useContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load user data from AsyncStorage on app start
//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         const userData = await AsyncStorage.getItem("user_data");
//         if (userData) {
//           const parsedUser = JSON.parse(userData);
//           setUser(parsedUser);
//           console.log("User loaded from AsyncStorage:", parsedUser);
//         }
//       } catch (error) {
//         console.error("Error loading user data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadUserData();
//   }, []);

//   // Enhanced setUser function that also saves to AsyncStorage
//   const updateUser = async (userData) => {
//     try {
//       if (userData) {
//         await AsyncStorage.setItem("user_data", JSON.stringify(userData));
//         console.log("User data saved to AsyncStorage:", userData);
//       } else {
//         await AsyncStorage.removeItem("user_data");
//         console.log("User data removed from AsyncStorage");
//       }
//       setUser(userData);
//     } catch (error) {
//       console.error("Error saving user data:", error);
//       // Still update the state even if AsyncStorage fails
//       setUser(userData);
//     }
//   };

//   // Logout function to clear user data
//   const logout = async () => {
//     try {
//       await AsyncStorage.multiRemove(["user_data", "access_token", "user_id"]);
//       setUser(null);
//       console.log("User logged out and data cleared");
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <UserContext.Provider value={{ 
//       user, 
//       setUser: updateUser, 
//       logout, 
//       isLoading 
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };
