import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function createBranch(req: Request, res: Response) {
  // try {
  const {
    name,
    address,
    provinceId,
    cityId,
    postalCode,
    latitude,
    longitude,
    userId,
  } = req.body;

  const newBranch = await prisma.branch.create({
    data: {
      name,
      address,
      provinceId: Number(provinceId),
      cityId: Number(cityId),
      postalCode,
      latitude: Number(latitude),
      longitude: Number(longitude),
      userId: Number(userId),
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Branch created successfully',
    data: newBranch,
  });
  // } catch (error) {
  //   console.error(error);
  //   res
  //     .status(400)
  //     .json({ status: 'error', message: 'Failed to create branch' });
  // }
}
