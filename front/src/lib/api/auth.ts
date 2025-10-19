import { apiClient } from './client';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData extends LoginData {
  role?: 'participant' | 'admin';
}

export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
};
