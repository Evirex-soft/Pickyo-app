import { api } from '@/api/axios';

export const completeUserProfile = async (data: any) => {
  const response = await api.put('/users/complete-profile', data);
  return response.data;
};
