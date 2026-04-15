import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';
import { env } from '../../config/env';
import { registerUser, loginUser, logoutService } from './auth.service';
import { generateAccessToken, generateRefreshToken } from '../../utils/token';

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    res.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  await logoutService(userId);

  res.json({ message: 'Logged out' });
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    res.status(403).json({ message: 'Expired token' });
  }
};
