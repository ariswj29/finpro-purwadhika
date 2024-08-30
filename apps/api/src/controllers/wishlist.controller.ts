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

export const addToWishlist = async (req: Request, res: Response) => {
  const { productId, userId } = req.body;

  // const wishlist = await prisma.wishlist.create({
  //   data: {
  //     productId: parseInt(productId),
  //     userId,
  //   },
  // });

  res.json({ code: 200, status: 'success', data: 'wishlist' });
};

export const getCount = async (req: Request, res: Response) => {
  const countWishlist = await prisma.wishlist.count();
  const countCart = await prisma.cart.count({
    where: {
      isActive: true,
    },
  });

  res.json({
    code: 200,
    status: 'success',
    data: { wishlist: countWishlist, cart: countCart },
  });
};

export const removeWishlist = async (req: Request, res: Response) => {
  const { id } = req.params;

  const wishlist = await prisma.wishlist.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.json({ code: 200, status: 'success', data: wishlist });
};
