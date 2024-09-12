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

export async function getBranch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const response = await prisma.branch.findUnique({
      where: { id: Number(id) },
    });

    if (!response) throw new Error(`branch with ${id} ID is not found`);

    res.status(200).json({
      status: 'success',
      message: 'success get branch',
      data: response,
    });
  } catch (error) {
    res.status(400).json({ error: 'An unexpected error occurred' });
  }
}
