import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';
import { Prisma } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { usersSchema } from '@/schemas/user.schema';
import * as yup from 'yup';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, page, limit = '10' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { username: { contains: search as string } },
          { email: { contains: search as string } },
        ],
      }),
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const usersWithIndex = users.map((user, index) => ({
      ...user,
      no: (pageNumber - 1) * limitNumber + index + 1,
    }));

    const totalUsers = await prisma.user.count({ where });
    const totalPages = Math.ceil(totalUsers / limitNumber);

    res.status(200).json({
      message: 'success',
      data: usersWithIndex,
      pagination: {
        totalItems: totalUsers,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

export const createUsers = async (req: Request, res: Response) => {
  try {
    await usersSchema.validate(req.body, { abortEarly: false });

    const { username, role, email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.json({
        status: 'error',
        message: 'User already exists',
      });
    }
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username,
        role,
        email,
        password: hashedPassword,
        isVerified: true,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'User successfully created',
      data: user,
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
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

export const updateUsers = async (req: Request, res: Response) => {
  try {
    await usersSchema.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const { username, role, email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username,
        role,
        email,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'User successfully updated',
      data: updatedUser,
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
};

export const deleteUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'User successfully deleted',
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};
