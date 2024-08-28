import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { limit = '8' } = req.query;
    const limitNumber = parseInt(limit as string, 10);

    const products = await prisma.product.findMany({
      take: limitNumber,
    });

    res.status(200).json({
      status: 'success',
      message: 'success',
      data: products,
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
}
