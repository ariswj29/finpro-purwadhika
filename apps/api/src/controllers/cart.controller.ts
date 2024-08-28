import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export const getAllCart = async (req: Request, res: Response) => {
  const cart = await prisma.productCart.findMany({
    include: {
      product: true,
    },
    where: {
      cart: {
        isActive: true,
      },
    },
  });

  res.json({ code: 200, status: 'success', data: cart });
};

export const removeCart = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.cart.update({
    where: {
      id: Number(id),
    },
    data: {
      isActive: false,
    },
  });

  res.json({ code: 200, status: 'success', message: 'Cart removed' });
};
