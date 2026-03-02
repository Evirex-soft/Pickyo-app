import 'dotenv/config';
import { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { prisma } from '../config/prisma';

export const googleCallback = async (req: any, res: Response) => {
  const user = req.user;

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  if (!user.isProfileComplete) {
    return res.redirect(`${process.env.FRONTEND_URL}/complete-profile`);
  }

  if (user.role === 'admin') {
    return res.redirect(`${process.env.FRONTEND_URL}/admin/dashboard`);
  }

  if (user.role === 'driver') {
    return res.redirect(`${process.env.FRONTEND_URL}/driver/dashboard`);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};
