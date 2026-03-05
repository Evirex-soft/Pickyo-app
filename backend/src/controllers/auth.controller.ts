import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { registerSchema } from '../validations/auth.schema';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { VehicleType } from '@prisma/client';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password, phone, role, userType, vehicleType } = validatedData;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role,
        },
      });

      await tx.wallet.create({
        data: { userId: user.id },
      });

      if (role === 'customer') {
        await tx.customerProfile.create({
          data: { userId: user.id, userType },
        });
      }

      if (role === 'driver') {
        await tx.driverProfile.create({
          data: { userId: user.id, vehicleType: vehicleType as VehicleType },
        });
      }

      return user;
    });

    const accessToken = generateAccessToken(result.id, result.role!);
    const refreshToken = generateRefreshToken(result.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: result.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info(`User registered successfully: ${email}`);
    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: 'Registration successful' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0].message,
      });
    }

    logger.error('Registration error', error);

    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    logger.error(`Login failed: No user found with email ${email}`);
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Ensure the user is logging in with the correct role
  if (user.role !== role) {
    logger.error(`Role mismatch for ${email}`);
    return res.status(403).json({ message: 'Access denied for this role' });
  }

  // If user registered via OAuth, they won't have a password
  if (!user.password) {
    return res.status(400).json({ message: 'Use Google login' });
  }

  const valid = await bcrypt.compare(password, user.password!);
  if (!valid) {
    logger.error(`Login failed: Invalid password for user ${email}`);
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user.id, user.role!);
  const refreshToken = generateRefreshToken(user.id);

  logger.info(`User logged in successfully: ${email}`);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(200)
    .json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
};
