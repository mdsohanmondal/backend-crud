import bcrypt from 'bcrypt';
import validator from 'validator';
import prisma from '../../utils/prisma';
import { generateAccessToken, generateRefreshToken } from '../../utils/token';

export const registerUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const { password } = data;
  // validation
  const email = data.email.trim().toLocaleLowerCase();
  const username = data.username.trim();
  if (!email) throw new Error('Email must required');
  if (!password) throw new Error('Password must required');
  if (!username) throw new Error('Username must required');

  const isLongPass = password.length > 3 ? true : false;

  if (!validator.isEmail(email)) throw new Error('Invalid email format');
  if (!isLongPass) throw new Error('Password length will be minimum 4');

  // database query
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  // if not found user then goat an error
  if (existing) {
    throw new Error('Email already exists');
  }

  // hashing password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const { password } = data;
  const email = data.email.trim().toLocaleLowerCase();

  // validation
  if (!validator.isEmail(email)) throw new Error('Invalid email format');
  if (!email) throw new Error('Email must required');
  if (!password) throw new Error('Password must required');

  // database query
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const userError = 'Email or password was incorrect';

  if (!user) throw new Error(userError);

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) throw new Error(userError);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };
};

export const logoutService = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};
