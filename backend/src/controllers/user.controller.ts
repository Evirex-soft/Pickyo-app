import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateAccessToken } from '../utils/token';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const completeProfileController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.user.userId;
  const { role, phone, userType, vehicleType } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        phone,
        isProfileComplete: true,

        ...(role === 'customer' && {
          customerProfile: {
            upsert: {
              create: { userType },
              update: { userType },
            },
          },
        }),

        ...(role === 'driver' && {
          driverProfile: {
            upsert: {
              create: { vehicleType },
              update: { vehicleType },
            },
          },
        }),

        // Create wallet
        wallet: {
          upsert: {
            create: { balance: 0 },
            update: {},
          },
        },
      },
      include: {
        customerProfile: true,
        driverProfile: true,
        wallet: true,
      },
    });

    logger.info(`User ${userId} completed profile as ${role}`);
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error(`Error updating profile for user ${userId}: ${error}`);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};

// Refresh Token
export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Check if token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    //  Match decoded ID with DB user
    if (decoded.userId !== storedToken.userId) {
      return res.status(403).json({ message: 'Token mismatch' });
    }

    // Check expiry
    if (storedToken.expiresAt < new Date()) {
      logger.info(`Refresh token expired for user ${storedToken.userId}`);
      return res.status(403).json({ message: 'Refresh token expired' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(storedToken.user.id, storedToken.user.role);

    // send new acess token
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    logger.info(`Access token refreshed for user ${storedToken.userId}`);
    return res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {}
};
