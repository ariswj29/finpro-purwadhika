import prisma from '@/helpers/prisma';
import { Request, Response } from 'express';

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
        user: { connect: { id: Number(userId) } },
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
    const { userId, id } = req.params;

    console.log(id, 'id');
    console.log(userId, 'userId');

    const conditions: any[] = [];

    if (id) {
      conditions.push({ id: Number(id) });
    }
    if (userId) {
      conditions.push({ userId: Number(userId) });
    }

    if (conditions.length === 0) {
      throw new Error('No valid parameters provided');
    }

    const response = await prisma.branch.findFirst({
      where: {
        OR: conditions,
      },
    });

    if (!response) {
      throw new Error('Branch not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched branch',
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

    const branch = await prisma.branch.findMany({
      where: {
        OR: [
          { name: { contains: search as string } },
          { address: { contains: search as string } },
        ],
      },
      select: {
        id: true,
        name: true,
        address: true,
        postalCode: true,
        latitude: true,
        longitude: true,
        provinceId: true,
        cityId: true,
        userId: true,
        city: true,
        province: true,
        user: true,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const branchWithIndex = branch.map(
      (
        item: {
          id: number;
          name: string;
          address: string;
          user: { id: number; username: string | null } | null;
          province: { name: string };
          city: { name: string };
        },
        index: number,
      ) => ({
        ...item,
        no: (pageNumber - 1) * limitNumber + index + 1,
      }),
    );

    const totalBranch = await prisma.branch.count({
      where: {
        OR: [
          { name: { contains: search as string } },
          { address: { contains: search as string } },
        ],
      },
    });
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
  try {
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

    const user = await prisma.user.findUnique({
      where: { id: Number(userId), branch: null },
    });

    if (!user) {
      return res.status(200).json({
        status: 'error',
        message: 'User not found or already has a branch',
      });
    }

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
      message: 'Branch successfully updated',
      data: promotion,
    });
  } catch (error) {
    res.status(400).json({ message: 'something went wrong' });
  }
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
