import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export const getAllWishlist = async (req: Request, res: Response) => {
  const wishlist = await prisma.wishlist.findMany({
    include: {
      product: true,
    },
  });

  res.json({ code: 200, status: 'success', data: wishlist });
};
