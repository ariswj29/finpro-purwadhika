import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const branch = await prisma.branch.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    const totalSales = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: 'DELIVERED',
      },
    });

    const totalProduct = await prisma.product.count();

    const totalStock = await prisma.productBranch.aggregate({
      _sum: {
        stock: true,
      },
      where: {
        branchId: branch ? branch.id : undefined,
      },
    });

    const salesPerProduct = await prisma.orderProduct.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
    });
    const formattedSales = salesPerProduct.map(
      (item: { _sum: { quantity: number | null } }) => item._sum.quantity ?? 0,
    );

    const stockPerProduct = await prisma.productBranch.groupBy({
      by: ['productId'],
      _sum: {
        stock: true,
      },
      where: {
        branchId: branch ? branch.id : undefined,
      },
    });
    const formattedStock = stockPerProduct.map(
      (item: { _sum: { stock: number | null } }) => item._sum.stock ?? 0,
    );

    console.log(formattedSales, 'formattedSales');

    res.json({
      totalSales: totalSales._sum.total,
      totalProduct: totalProduct,
      totalStock: totalStock._sum.stock,
      salesPerProduct: formattedSales,
      stockPerProduct: formattedStock,
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};
