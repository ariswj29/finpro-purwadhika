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

    return res.status(201).json({
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
    include: { city: true, province: true },
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

export async function addressDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const response = await prisma.address.findUnique({
      where: { id: Number(id) },
    });

    if (!response) throw new Error(`address with ${id} ID is not found`);

    res.status(200).json({
      status: 'success',
      message: 'success get address',
      data: response,
    });
  } catch (error) {
    res.status(400).json({ error: 'An unexpected error occurred' });
  }
}

export const editAddress = async (req: Request, res: Response) => {
  // try {
  const { id } = req.params;
  const {
    name,
    address,
    cityId,
    provinceId,
    postalCode,
    isPrimary,
    isDeleted,
    longitude,
    latitude,
    userId,
  } = req.body;

  const response = await prisma.address.update({
    where: { id: Number(id) },
    data: {
      name,
      address,
      cityId: Number(cityId),
      provinceId: Number(provinceId),
      postalCode,
      isPrimary: Boolean(isPrimary),
      isDeleted: Boolean(isDeleted),
      longitude: Number(longitude),
      latitude: Number(latitude),
      userId,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Address successfully updated',
    data: response,
  });
  // } catch (error) {
  //   res.status(400).json({ error: 'An unexpected error occurred' });
  // }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const response = await prisma.address.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'success delete event',
      data: response,
    });
  } catch (error) {
    res.status(400).json({ error: 'An unexpected error occurred' });
  }
};

export const setPrimaryAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.body, 'reqaddress');
  const { userId } = req.body;

  // try {

  await prisma.address.updateMany({
    where: {
      userId: Number(userId),
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });

  const updatedAddress = await prisma.address.update({
    where: {
      id: Number(id),
    },
    data: {
      isPrimary: true,
    },
  });

  return res.status(200).json({
    status: 'success',
    message: 'Successfully set address as primary',
    data: updatedAddress,
  });
  // } catch (error) {
  //   res.status(400).json({ error: 'An unexpected error occurred' });
  // }
};
