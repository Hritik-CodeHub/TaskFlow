import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@taskflow_token';
const USER_KEY = '@taskflow_user';

export interface User {
  id: string;
  name: string;
  email: string;
}

export const storage = {
  // Store JWT token
  setToken: async (token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  // Get JWT token
  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  // Store user
  setUser: async (user: User) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user
  getUser: async (): Promise<User | null> => {
    const user = await AsyncStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  // Clear authentication data
  clearAuth: async () => {
    await AsyncStorage.removeMany([
      TOKEN_KEY,
      USER_KEY,
    ]);
  },
};