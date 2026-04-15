import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET as string, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d',
  });
};
