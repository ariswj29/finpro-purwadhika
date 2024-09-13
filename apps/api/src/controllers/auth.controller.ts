import { loginSchema } from '@/schemas/login.schema';
import { registerSchema } from '@/schemas/register.schema';
import { sign, verify } from 'jsonwebtoken';
import { compare, genSalt, hash } from 'bcrypt';
import { Request, Response } from 'express';
import * as yup from 'yup';
import { generateVerificationToken } from '@/helpers/generateVerificatioonToken';
import { sendVerificationEmail } from '@/utils/verify.nodemailer';
import prisma from '@/helpers/prisma';
import { sendResetPassword } from '@/utils/resetPassword.nodemailer';

export const register = async (req: Request, res: Response) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const { username, email } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.json({
        status: 'error',
        message: 'User already exist',
      });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        provider: 'credentials',
      },
    });

    const verificationToken = generateVerificationToken(user.id);
    const name = `${user.username}`;
    sendVerificationEmail(email, verificationToken, name);

    res.status(201).json({
      status: 'success',
      message:
        'You have successfully registered. Please check your email to verify your account',
      data: user,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: error.errors,
      });
    }
    res.status(400).json({ error: 'An unexpacted error occured' });
  }
};

export async function login(req: Request, res: Response) {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user || !user.password) {
      return res.json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const invalidPassword = await compare(password, user.password);
    if (!invalidPassword) {
      return res.json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    if (!user.isVerified) {
      return res.json({
        status: 'error',
        message: 'Please verify your email to login',
      });
    }

    const jwtPayload = {
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = await sign(jwtPayload, 'mySecret', {
      expiresIn: '12h',
    });

    const data = {
      username: user.username,
      email: user.email,
      role: user.role,
      id: user.id,
      image: user.image,
    };

    res.status(200).json({
      status: 'success',
      message: 'You have successfully logged in',
      data,
      token,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: error.errors,
      });
    }
    res.status(400).json({ error: 'An unexpected error occurred' });
  }
}

export const verificationEmail = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    console.log(password, 'password');
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid or missing token',
      });
    }

    const secret = process.env.JWT_SECRET_KEY || 'secret-key';
    const decoded = verify(token as string, secret) as { userId: string };
    console.log(decoded, 'decoded');
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const user = await prisma.user.update({
      where: {
        id: Number(decoded.userId),
      },
      data: {
        isVerified: true,
        password: hashedPassword,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Email succesfully verify',
      user: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Email verification failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const verifyResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log(email, 'masukin email');
    console.log(req, 'req body');

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    console.log(user, 'user');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    const verificationToken = generateVerificationToken(user.id);
    const name = `${user.username}`;
    sendResetPassword(email, verificationToken, name);

    return res.status(201).json({
      status: 'success',
      message:
        'You have successfully reset your Password. Please check your email to reset yout password',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Reset Password failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
