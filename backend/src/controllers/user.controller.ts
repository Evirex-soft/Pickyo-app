import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateAccessToken } from '../utils/token';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { randomBytes, createHash } from 'crypto';
import { sendResetEmail } from '../utils/sendResetEmail';
import bcrypt from 'bcrypt';

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
    const newAccessToken = generateAccessToken(storedToken.user.id, storedToken.user.role!);

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

// Forgot Password
export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.isActive) {
      return res.status(403).json({ message: 'Account disabled' });
    }

    if (user) {
      // Delete old token
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

      const resetToken = randomBytes(32).toString('hex');

      const hashedToken = createHash('sha256').update(resetToken).digest('hex');

      await prisma.passwordResetToken.create({
        data: {
          token: hashedToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
        },
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      logger.info(`Password reset requested for user ${user.email}`);
      await sendResetEmail(user.email, resetUrl);
    }
    return res
      .status(200)
      .json({ message: 'If that email is registered, a reset link has been sent' });
  } catch (error) {
    logger.error(`Error in forgot password for email ${email}: ${error}`);
    return res.status(500).json({ message: 'Error processing request' });
  }
};

// Reset password controller
export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // Hash token
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Find token in DB
    const resetEntry = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetEntry) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check expiry
    if (resetEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user password
    await prisma.user.update({
      where: { id: resetEntry.userId },
      data: { password: hashedPassword },
    });

    // Delete reset token
    await prisma.passwordResetToken.delete({ where: { token: hashedToken } });

    // forced logout
    await prisma.refreshToken.deleteMany({ where: { userId: resetEntry.userId } });

    logger.info(`Password reset successful for user ${resetEntry.userId}`);
    return res.status(200).json({
      message: 'Password reset successful. Please login again.',
    });
  } catch (error) {
    logger.error(`Error in reset password: ${error}`);
    return res.status(500).json({ message: 'Error processing request' });
  }
};
