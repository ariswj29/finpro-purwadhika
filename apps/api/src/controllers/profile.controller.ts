import { Response, Request } from 'express';
import { genSalt, hash } from 'bcrypt';
import prisma from '@/helpers/prisma';

export const updateProfile = async (req: Request, res: Response) => {
  //   try {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const image = req.file?.filename;

  let updateData: any = {};

  if (username) updateData.username = username;
  if (email) updateData.email = email;

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
  //   } catch (error) {
  //     console.error('Update failed:', error); // Add logging for debugging

  // if (error instanceof yup.ValidationError) {
  //   return res.status(400).json({
  //     status: 'error',
  //     message: error.errors,
  //   });
  // }

  //     res.status(400).json({
  //       status: 'error',
  //       message: 'An unexpected error occurred',
  //     });
  //   }
};
