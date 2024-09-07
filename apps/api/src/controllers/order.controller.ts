import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export async function getAllOrderList(req: Request, res: Response) {
  try {
    const orderList = await prisma.order.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        paymentStatus: true,
        total: true,
      },
    });

    return res.status(200).json(orderList);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getOrderList(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findMany({
      where: {
        userId: Number(id),
        paymentStatus: {
          in: ['UNPAID', 'PAID', 'PROCESSING', 'SHIPPED', 'CANCELED'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully get Order',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { body } = req;
    const response = await prisma.order.create({
      data: {
        name: `ORDER-${new Date().getTime()}`,
        paymentStatus: 'UNPAID',
        shippingCost: body.shippingCost,
        total: body.total,
        paymentMethod: body.paymentMethod,
        courier: body.courier,
        expirePayment: new Date(new Date().getTime() + 60 * 60 * 1000),
        address: {
          connect: {
            id: body.addressId,
          },
        },
        branch: {
          connect: {
            id: body.branchId,
          },
        },
        user: {
          connect: {
            id: body.userId,
          },
        },
      },
    });

    console.log(body, 'body');

    body.cart.forEach(async (item: any) => {
      await prisma.orderProduct.create({
        data: {
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          product: {
            connect: {
              id: item.productId,
            },
          },
          order: {
            connect: {
              id: response.id,
            },
          },
        },
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully create Order',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getOrderListComplete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findMany({
      where: {
        userId: Number(id),
        paymentStatus: {
          in: ['DELIVERED'],
        },
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully get Order',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getOrderDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const orderDetail = await prisma.orderProduct.findMany({
      where: {
        orderId: Number(id),
      },
      include: {
        product: true,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully get Order Detail',
      data: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function cancelOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const response = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        paymentStatus: 'CANCELED',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully cancel Order',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function confirmOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const response = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        paymentStatus: 'DELIVERED',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully confirm Order',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function uploadPayment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const paymentProof = req.file?.filename;

    if (!paymentProof) {
      return res.status(400).json({ message: 'File not uploaded' });
    }

    const response = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        paymentProof,
        paymentStatus: 'PAID',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully uploaded payment',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
