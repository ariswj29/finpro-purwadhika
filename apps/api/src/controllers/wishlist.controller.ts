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

  const searchWishlist = await prisma.wishlist.findFirst({
    where: {
      productId: parseInt(productId),
      userId,
    },
  });

  if (searchWishlist) {
    return res.status(400).json({
      code: 400,
      status: 'error',
      message: 'Item already in wishlist',
    });
  }

  const wishlist = await prisma.wishlist.create({
    data: {
      productId: parseInt(productId),
      userId,
    },
  });

  res.json({
    code: 200,
    status: 'success',
    data: wishlist,
    message: 'Item added to wishlist',
  });
};

export const getWishlist = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      code: 400,
      status: 'error',
      message: 'Invalid userId. It must be a number.',
    });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: userId },
    include: {
      product: true,
    },
  });

  res.json({ code: 200, status: 'success', data: wishlist });
};

export const getCount = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      code: 400,
      status: 'error',
      message: 'Invalid userId. It must be a number.',
    });
  }

  try {
    const countWishlist = await prisma.wishlist.count({
      where: { userId: userId },
    });

    const countCart = await prisma.productCart.count({
      where: {
        cart: {
          isActive: true,
          userId: userId,
        },
      },
    });

    res.json({
      code: 200,
      status: 'success',
      data: { wishlist: countWishlist, cart: countCart },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Something went wrong.',
      error: (error as any).message,
    });
  }
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
