import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const updateUserContext = (newUser) => {
    setUser(newUser);
  };
  const updateCompanyName = (newCompanyName) => {
    setCompanyName(newCompanyName);
  };

  return (
    <UserContext.Provider
      value={{ user, updateUserContext, updateCompanyName, companyName }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
