import { api } from '@/api/axios';
import { ProfileResponse } from '@/types/auth.types';

export const completeUserProfile = async (data: any) => {
  const response = await api.put('/users/complete-profile', data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/users/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
  const response = await api.post('/users/reset-password', data);
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const { data } = await api.get<ProfileResponse>('/users/me');
  return data;
}