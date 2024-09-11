import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export async function getAllOrderList(req: Request, res: Response) {
  try {
    const { search = '', page = '1', limit = '10', branchId } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const parsedBranchId = branchId ? parseInt(branchId as string, 10) : null;

    const orders = await prisma.order.findMany({
      where: {
        name: {
          contains: search as string,
        },
        branch:
          parsedBranchId && parsedBranchId !== 1
            ? {
                userId: parsedBranchId,
              }
            : undefined,
      },
      select: {
        id: true,
        name: true,
        paymentStatus: true,
        shippingCost: true,
        total: true,
        paymentProof: true,
        paymentMethod: true,
        expirePayment: true,
        shippedAt: true,
        createdAt: true,
        orderProducts: {
          select: {
            id: true,
            quantity: true,
            price: true,
            total: true,
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        address: {
          select: {
            id: true,
            name: true,
            address: true,
            postalCode: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const ordersWithIndex = orders.map((order, index) => ({
      ...order,
      no: (pageNumber - 1) * limitNumber + index + 1,
    }));

    const totalOrders = await prisma.order.count({
      where: {
        branch:
          parsedBranchId && parsedBranchId !== 1
            ? {
                userId: parsedBranchId,
              }
            : undefined,
      },
    });

    const totalPages = Math.ceil(totalOrders / limitNumber);

    res.status(200).json({
      status: 'success',
      message: 'success get all orders',
      data: ordersWithIndex,
      pagination: {
        totalItems: totalOrders,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getOrderList(req: Request, res: Response) {
  try {
    const { user_id } = req.params;
    const order = await prisma.order.findMany({
      where: {
        userId: Number(user_id),
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
    const { user_id } = req.params;
    const order = await prisma.order.findMany({
      where: {
        userId: Number(user_id),
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

export async function changeStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const paymentProof = req.file?.filename;

    const updateData: any = {
      paymentStatus: status,
    };

    if (paymentProof) {
      updateData.paymentProof = paymentProof;
    }

    const response = await prisma.order.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully updated Order',
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
