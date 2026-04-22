import { api } from '@/api/axios';
import { ProfileResponse } from '@/types/auth.types';
import { TripResponse } from '@/types/user.types';

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

export const getTrips = async (page: number, limit: number): Promise<TripResponse> => {
  const response = await api.get(`/users/trips?page=${page}&limit=${limit}`);
  return response.data;
}

export const getSavedPlaces = async () => {
  const response = await api.get('/users/places');
  return response.data;
}

export const addSavedPlace = async (placeData: any) => {
  const response = await api.post('/users/places', placeData);
  return response.data;
}

export const deleteSavedPlace = async (id: string) => {
  const response = await api.delete(`/users/places/${id}`);
  return response.data;
}