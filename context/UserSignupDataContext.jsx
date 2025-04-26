import React, { createContext, useContext, useState } from "react";

export const UserSignupDataContext = createContext();

export const UserSignupDataProvider = ({ children }) => {
  const [signupData, setSignupData] = useState(null);
  return (
    <UserSignupDataContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </UserSignupDataContext.Provider>
  );
};

export const useSignupData = () => useContext(UserSignupDataContext);
