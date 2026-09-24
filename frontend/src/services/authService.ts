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

// Forgot Password
export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', {
    email,
  });

  return response.data;
};

// Verify OTP
export const verifyOtp = async (email: string, otp: string) => {
  const response = await api.post('/auth/verify-otp', {
    email,
    otp,
  });

  return response.data;
};

// Reset Password
export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.post('/auth/reset-password', {
    email,
    newPassword,
  });

  return response.data;
};
