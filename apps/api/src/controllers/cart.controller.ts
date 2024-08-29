import e, { Request, Response } from 'express';
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

export const addCart = async (req: Request, res: Response) => {
  const { productId, userId } = req.body;

  const productCart = await prisma.productCart.findFirst({
    where: {
      productId: Number(productId),
      cart: {
        isActive: true,
        userId,
      },
    },
  });

  if (productCart) {
    await prisma.productCart.update({
      where: {
        id: productCart.id,
      },
      data: {
        quantity: productCart.quantity + 1,
      },
    });
  } else {
    const cart = await prisma.cart.create({
      data: {
        isActive: true,
        userId,
      },
    });
    await prisma.productCart.create({
      data: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: 1,
      },
    });
  }

  res.json({ code: 200, status: 'success', data: { productCart } });
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
