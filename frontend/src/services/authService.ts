import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);

  return response.data;
};

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);

  return response.data;
};