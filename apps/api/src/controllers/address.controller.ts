import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export const addAddress = async (req: Request, res: Response) => {
  const {
    name,
    address,
    cityId,
    provinceId,
    postalCode,
    longitude,
    latitude,
    userId,
  } = req.body;

  try {
    const response = await prisma.address.create({
      data: {
        name,
        address,
        postalCode,
        longitude,
        latitude,
        province: { connect: { id: Number(provinceId) } },
        city: { connect: { id: Number(cityId) } },
        user: { connect: { id: userId } },
      },
    });

    return res
      .status(201)
      .json({
        status: 'success',
        message: 'Successfully add address',
        data: response,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: 'error.message' });
  }
};

export const getAddress = async (req: Request, res: Response) => {
  const { userId } = req.query;

  const response = await prisma.address.findMany({
    where: {
      userId: Number(userId),
    },
  });

  return res.status(200).json({
    status: 'success',
    message: 'Successfully get data address user',
    data: response,
  });
};

export const getProvince = async (req: Request, res: Response) => {
  const response = await prisma.province.findMany();

  return res.status(200).json({
    status: 'success',
    message: 'Successfully get data province',
    data: response,
  });
};

export const getCity = async (req: Request, res: Response) => {
  const { provinceId } = req.query;

  const response = await prisma.city.findMany({
    where: {
      provinceId: Number(provinceId),
    },
  });

  return res.status(200).json({
    status: 'success',
    message: 'Successfully get data city',
    data: response,
  });
};
