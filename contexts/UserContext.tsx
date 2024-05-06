'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  access_token: string;
  refresh_token: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
