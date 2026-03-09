import { api } from '@/api/axios';
import { RegisterPayload, BasicResponse } from '@/types/auth.types';

export const registerUser = async (payload: RegisterPayload): Promise<BasicResponse> => {
  const { data } = await api.post<BasicResponse>('/auth/register', payload);
  return data;
};

export const loginUser = async (
  email: string,
  password: string,
  role: string,
): Promise<BasicResponse> => {
  const { data } = await api.post<BasicResponse>('/auth/login', {
    email,
    password,
    role,
  });
  return data;
};


export const logoutUser = async (): Promise<BasicResponse> => {
  const { data } = await api.post<BasicResponse>('/auth/logout');
  return data;
};

