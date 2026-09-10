import { api } from './apiClient';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials) =>
    (await api.post<AuthResponse>('/user/login', credentials)).data,
  register: async (credentials: RegisterCredentials) =>
    (await api.post<AuthResponse>('/user/register', credentials)).data,
};
