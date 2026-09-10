import axios from 'axios';
import Config from 'react-native-config';
import { storage } from '../utils/storage';

const baseURL = Config.API_URL;
console.log('API Base URL:', baseURL);
export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await storage.clearAuth();
    }
    throw error;
  }
);
