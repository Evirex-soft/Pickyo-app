import { z } from 'zod';

const roleEnum = z.enum(['customer', 'driver']);

const vehicleEnum = z.enum(['bike', 'pickups', 'mini_truck', 'truck']);

const userTypeEnum = z.enum(['individual', 'business']);

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),

    email: z.string().email('Invalid email format').toLowerCase(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])/,
        'Password must contain at least 1 uppercase letter and 1 number',
      ),

    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'), // Indian format

    role: roleEnum,

    userType: userTypeEnum.optional(),

    vehicleType: vehicleEnum.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'customer' && !data.userType) {
      ctx.addIssue({
        path: ['userType'],
        message: 'User type is required for customers',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.role === 'driver' && !data.vehicleType) {
      ctx.addIssue({
        path: ['vehicleType'],
        message: 'Vehicle type is required for drivers',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const completeProfileSchema = z
  .object({
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
    role: roleEnum,
    userType: userTypeEnum.optional(),
    vehicleType: vehicleEnum.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'customer' && !data.userType) {
      ctx.addIssue({
        path: ['userType'],
        message: 'User type is required for customers',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.role === 'driver' && !data.vehicleType) {
      ctx.addIssue({
        path: ['vehicleType'],
        message: 'Vehicle type is required for drivers',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),

  password: z.string().min(1, 'Password is required'),

  role: z.enum(['customer', 'driver', 'admin']),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Invalid reset token'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least 1 uppercase letter')
      .regex(/[a-z]/, 'Must include at least 1 lowercase letter')
      .regex(/[0-9]/, 'Must include at least 1 number')
      .regex(/[^A-Za-z0-9]/, 'Must include at least 1 special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
