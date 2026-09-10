import React, { createContext, useEffect, useMemo, useState } from 'react';
import {
  User,
} from '../types/auth.types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setUserData: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await storage.getUser();
        const storedToken = await storage.getToken();

        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
          await storage.clearAuth();
        }
      } finally {
        setIsBootstrapping(false);
      }
    };

    loadUser();
  }, []);
console.log(token)
  const logout = async () => {
    setToken(null);
    setUser(null);
    await storage.clearAuth();
  };

  const setUserData = async (user: User, token: string) => {
    setToken(token);
    setUser(user);
    await storage.setToken(token);
    await storage.setUser(user);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isBootstrapping,
      setUserData,
      logout,
    }),
    [user, token, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

