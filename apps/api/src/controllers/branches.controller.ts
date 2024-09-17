import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function createBranch(req: Request, res: Response) {
  try {
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
        postalCode,
        latitude: Number(latitude),
        longitude: Number(longitude),
        province: { connect: { id: Number(provinceId) } },
        city: { connect: { id: Number(cityId) } },
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Branch created successfully',
      data: newBranch,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: 'error', message: 'Failed to create branch' });
  }
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

export const getAllBranch = async (req: Request, res: Response) => {
  try {
    const { search, page, limit = '10' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const where: Prisma.BranchWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search as string } },
          { address: { contains: search as string } },
        ],
      }),
    };

    const branch = await prisma.branch.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        province: true,
        user: true,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const branchWithIndex = branch.map((item, index) => ({
      ...item,
      no: (pageNumber - 1) * limitNumber + index + 1,
    }));

    const totalBranch = await prisma.branch.count({ where });
    const totalPages = Math.ceil(totalBranch / limitNumber);

    res.status(200).json({
      status: 'success',
      message: 'success',
      data: branchWithIndex,
      pagination: {
        totalItems: totalBranch,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

export async function updateBranch(req: Request, res: Response) {
  // try {
  const { id } = req.params;
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

  const promotion = await prisma.branch.update({
    where: { id: Number(id) },
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
  res.status(200).json({
    status: 'success',
    message: 'branch successfully updated',
    data: promotion,
  });
  // } catch (error) {
  //   res.status(400).json({ message: 'something went wrong' });
  // }
}

export async function deleteBranch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const promotion = await prisma.branch.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({
      status: 'success',
      message: 'succeess delete branch',
      data: promotion,
    });
  } catch (error) {
    res.status(400).json({ message: 'something went wrong' });
  }
}
