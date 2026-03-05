export type Role = 'customer' | 'driver' | 'admin';

export type UserType = 'individual' | 'business';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  userType?: UserType;
  vehicleType?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'customer';
  isProfileComplete?: boolean;
  wallet?: {
    balance: number;
  };
}

export interface BasicResponse {
  message: string;
  user: User
}

export interface ProfileResponse {
  user: User
}
