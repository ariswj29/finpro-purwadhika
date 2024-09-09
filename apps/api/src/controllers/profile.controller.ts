import { Response, Request } from 'express';
import { genSalt, hash } from 'bcrypt';
import prisma from '@/helpers/prisma';
import { generateVerificationTokenNewEmail } from '@/helpers/generateVerificationTokenNewEmail';
import { sendNewEmail } from '@/utils/updateEmail.nodemailer';
import { verify } from 'jsonwebtoken';

export const getProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const profile = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!profile) throw new Error(`event with ${id} ID is not found`);

    res.status(200).json({
      status: 'success',
      message: 'success show event',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateEmailRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    const verificationToken = generateVerificationTokenNewEmail(id, email);

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    const name = `${user?.username}`;
    sendNewEmail(email, verificationToken, name);

    return res.status(201).json({
      status: 'success',
      message:
        'You have successfully update your email. Please check your email to verify',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'update email failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const verifyEmailChange = async (req: Request, res: Response) => {
  // try {
  const { token } = req.body;
  console.log(req, 'req token');

  if (!token) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing or invalid token',
    });
  }

  const secret = process.env.JWT_SECRET_KEY || 'secret-key';
  const decoded = verify(token, secret) as {
    userId: string;
    email: string;
  };

  const user = await prisma.user.findUnique({
    where: { id: Number(decoded.userId) },
  });

  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid token or user not found',
    });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: decoded.email, // Update email directly from token payload
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Email address updated and verified successfully',
    user: user,
  });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'error',
  //     message: 'Email verification failed',
  //     error: error instanceof Error ? error.message : 'Unknown error',
  //   });
  // }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const image = req.file?.filename;

    let updateData: any = {};

    if (username) updateData.username = username;

    // if (email) updateData.email = email;

    if (password) {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      updateData.password = hashedPassword;
    }

    if (image) {
      updateData.image = image;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update failed:', error); // Add logging for debugging

    // if (error instanceof yup.ValidationError) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: error.errors,
    //   });
    // }

    res.status(400).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
};
